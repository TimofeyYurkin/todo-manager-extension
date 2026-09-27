import * as vscode from 'vscode';
import * as path from 'path';

import { CommentBase, Comment, CommentType, PriorityLevel } from '../interfaces';

/* Класс для сканировария рабочего пространства на наличие комментариев и их последующего парсинга */
export class CommentScanner {
  private readonly commentPattern = new RegExp('^\\s*(?:#|//)\\s*(?<priority>!*)\\s*(?<type>TODO|FIX|BUG|NOTE)\\b(?<text>.*)$');
  
  /**
   * Ищет комментарии во всех файлах текущего рабочего пространства,
   * возвращает массив найденных комментариев в обработанном виде
   *
   * @returns {Promise<Comment[]>}: массив обработанных комментариев
   */
  async scanWorkspace(): Promise<Comment[]>  {
    const paths: vscode.Uri[] = await vscode.workspace.findFiles('**/*', '**/{node_modules,.git,dist,build}/**');
    const comments: Comment[] = [];

    if (paths.length === 0) {
      vscode.window.showErrorMessage('Failed to find any files in the current workspace');
      return comments;
    }

    for (const path of paths) {
      await this.parseFile(path, comments);
    }

    return comments;
  }

  /**
   * Ищет комментарии в файле, парсит их и сохраняет в результирующий массив
   *
   * @param {vscode.Uri} fileUri: уникальный идентификатор обрабатываемого файла 
   * @param {Comment[]} comments: результирющуй массив, в который записываются обработанные комментарии 
   * @returns {Promise<void>} 
   */
  private async parseFile(fileUri: vscode.Uri, comments: Comment[]): Promise<void> {
    const file = await vscode.workspace.openTextDocument(fileUri);
    const separator = file.eol === vscode.EndOfLine.LF ? '\n' : '\r\n';
    const lines = file.getText().split(separator);

    for (let i = 0; i < file.lineCount; i++) {
      const match = lines[i].match(this.commentPattern);

      try {
        const commentBase: CommentBase = this.parseCommentMatch(match);
        comments.push({
          ...commentBase,
          path: fileUri.path,
          filename: path.basename(fileUri.fsPath),
          line: i
        });
      }
      catch (e) {
        continue;
      }
    }
  }

  /**
   * Обрабатывает результат работы регулярного выражения для поиска комментариев,
   * выбрасывает ошибку, если результат регулярного выражения пустой,
   * возвращает базовую информацию о комментарии в противном случае
   *
   * @param {(RegExpMatchArray | null)} match: результат рабоыт регулярного выражения
   * @returns {CommentBase}: базовая информация о комментарии (тип, уровень приоритета, текст)
   */
  private parseCommentMatch(match: RegExpMatchArray | null): CommentBase {
    if (!match || !match.groups) {
      throw new Error('Invalid match');
    }

    const type: CommentType = match.groups['type'] as CommentType;
    const priority: PriorityLevel = Math.max(Math.min(match.groups['priority'].length, 3), 1) as PriorityLevel;
    const text = `${match.groups['text'].trim().replace(':', '')}`;

    return { type, priority, text };
  }
}