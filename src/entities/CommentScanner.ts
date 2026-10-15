/** 
 * ## `/entities/CommentScanner.ts`
 * 
 * Модуль, предоставляющий функционал для анализа текстовых файлов активного рабочего пространства в IDE
 * и для парсинга найденных комментариев, с которыми работает плагин.
 * 
 * @module
 */

import * as vscode from 'vscode';
import * as path from 'path';

import { CommentBase, Comment, CommentType, PriorityLevel } from '../interfaces';

/** 
 * Класс для анализа текстовых файлов активного рабочего пространства на наличие комментариев
 * и для парсинга найденных комментариев
*/
export class CommentScanner {
  /* Регулярное выражение для поиска комментариев, обрабатываемых плагином */
  private readonly commentPattern = new RegExp('^\\s*(?:#|//|\'\'\')\\s*(?<priority>!*)\\s*(?<type>TODO|FIX|BUG|NOTE)\\b(?<text>.*)$');

  /**
   * Анализирует текстовые файлы активного рабочего пространства на наличие комментариев.
   * Найденные комментарии обрабатываются приватным методом-парсером.
   *
   * @returns массив найденных обработанных комментариев
   */
  async scanWorkspace(): Promise<Comment[]>  {
    const paths = await vscode.workspace.findFiles(
      '**/*', 
      '{**/node_modules/**,**/.idea/**,**/build/**,**/.git/**,**/*.{png,jpg,jpeg,gif,ico,pdf,zip,exe,dll,woff,woff2}}'
    );

    const comments: Comment[] = [];

    if (paths.length === 0) {
      vscode.window.showErrorMessage('Failed to find any files in the current workspace');
      return comments;
    }

    for (const path of paths) {
      await this.parseFile(path, comments);
    }

    if (comments.length === 0) {
      vscode.window.showWarningMessage('Failed to find any specific comments in the current workspace');
    }
  
    return comments;
  }

  /**
   * Ищет строки в файле с идентификатором `fileUri`, соответствующие регулярному выражению для комментариев.
   * Парсит найденные соответствия в объекты с информацией о комментариях.
   *
   * @param fileUri уникальный идентификатор обрабатываемого файла 
   * @param comments результирющуй массив, в который записываются обработанные комментарии
   */
  private async parseFile(fileUri: vscode.Uri, comments: Comment[]): Promise<void> {
    let file = null;

    try {
      file = await vscode.workspace.openTextDocument(fileUri);
    }
    catch (e) {
      return;
    }

    const separator = file.eol === vscode.EndOfLine.LF ? '\n' : '\r\n';
    const lines = file.getText().split(separator);

    for (let i = 0; i < file.lineCount; i++) {
      const match = lines[i].match(this.commentPattern);

      const parsingResult = this.parseCommentMatch(match);

      if (!parsingResult) {
        continue;
      }

      comments.push({
        ...parsingResult,
        path: fileUri.path,
        filename: path.basename(fileUri.fsPath),
        line: i
      });

    }
  }

  /**
   * Обрабатывает результат работы регулярного выражения для поиска комментариев в текстовых файлах
   * 
   * @param match результат работы регулярного выражения
   * @returns `CommentBase`, если результат работы регулярного выражения непустой, иначе `null`
   */
  private parseCommentMatch(match: RegExpMatchArray | null): CommentBase | null {
    if (!match || !match.groups) {
      return null;
    }

    const type: CommentType = match.groups['type'] as CommentType;
    const priority: PriorityLevel = Math.max(Math.min(match.groups['priority'].length, 3), 1) as PriorityLevel;
    const text = `${match.groups['text'].trim().replace(':', '')}`;

    return { type, priority, text };
  }
}