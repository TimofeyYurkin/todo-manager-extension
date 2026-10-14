import * as vscode from 'vscode';
import * as path from 'path';

import { CommentBase, Comment, CommentType, PriorityLevel } from '../interfaces';

/* Класс, реализующий логику анализа текстовых файлов рабочего пространства на наличие комментариев и парсинг найденных комментариев */
export class CommentScanner {
  private readonly commentPattern = new RegExp('^\\s*(?:#|//)\\s*(?<priority>!*)\\s*(?<type>TODO|FIX|BUG|NOTE)\\b(?<text>.*)$');
  
  /**
   * Ищет текстовые файлы текущего рабочего пространства и парсит их на наличие комментариев с помощью приватного метода,
   * возвращает массив найденных комментариев, обработанных парсером
   *
   * @returns {Promise<Comment[]>}: массив обработанных комментариев
   */
  async scanWorkspace(): Promise<Comment[]>  {
    const paths: vscode.Uri[] = await vscode.workspace.findFiles(
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
   * Парсит комментарии, найденные в файле с идентификатором fileUri, и сохраняет их в результирующий массив comments
   *
   * @param {vscode.Uri} fileUri: уникальный идентификатор обрабатываемого файла 
   * @param {Comment[]} comments: результирющуй массив, в который записываются обработанные комментарии 
   * @returns {Promise<void>} 
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

      const parsingResult: CommentBase | null = this.parseCommentMatch(match);

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
   * Обрабатывает результат работы регулярного выражения для поиска комментария в строке файла,
   * если результат ненулевой, возвращает объект с базовой информацией о комментарии,
   * в противном случае возвращает null
   *
   * @param {(RegExpMatchArray | null)} match: результат работы регулярного выражения
   * @returns {CommentBase | null}: базовая информация о комментарии (тип комментария, уровень приоритета, текст комментария) | null
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