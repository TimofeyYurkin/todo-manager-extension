import * as vscode from 'vscode';
import * as path from 'path';

import { Comment, CommentType } from '../interfaces';

export class CommentScanner {
  private readonly COMMENT_PATTERN = new RegExp('^\\s*(?:#|//)\\s*(?<priority>!*)\\s*(?<type>TODO|FIX|BUG|NOTE)\\b(?<text>.*)$');
  
  async scanWorkspace(): Promise<Comment[]>  {
    const paths = await vscode.workspace.findFiles('**/*', '**/{node_modules,.git,dist,build}/**');
    const comments: Comment[] = [];

    if (paths.length === 0) {
      vscode.window.showErrorMessage('No files have been found in the current workspace');
      return comments;
    }

    for (const path of paths) {
      await this.parseFile(path, comments);
    }

    return comments;
  }

  private async parseFile(filePath: vscode.Uri, commentsArr: Comment[]) {
    const file = await vscode.workspace.openTextDocument(filePath);
    const separator = file.eol === vscode.EndOfLine.LF ? '\n' : '\r\n';

    const lines = file.getText().split(separator);

    for (let i = 0; i < file.lineCount; i++) {
      const match = lines[i].match(this.COMMENT_PATTERN);

      if (!match || !match.groups) {
        continue;
      }

      const type: CommentType = match.groups['type'] as CommentType;
      const priority = Math.max(
        Math.min(match.groups['priority'].length, 3), 1
      );
      const text = `line ${i + 1}: ${match.groups['text'].trim().replace(':', '')}`;

      commentsArr.push({
        type,
        priority,
        text,
        path: filePath.path,
        filename: path.basename(filePath.fsPath),
        line: i
      });
    }
  }
}