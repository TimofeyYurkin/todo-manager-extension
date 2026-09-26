import * as vscode from 'vscode';
import { Comment, CommentType } from '../interfaces';

export class CommentScanner {
  private COMMENT_PATTERN = new RegExp('^\\s*(?:#|//)\\s*(?<priority>!*)\\s*(?<type>TODO|FIX|BUG|NOTE)\\b.*$');
  
  async scanWorkspace(): Promise<Comment[] | null>  {
    const paths = await vscode.workspace.findFiles('**/*', '**/{node_modules,.git,dist,build}/**');

    if (paths.length === 0) {
      vscode.window.showErrorMessage('No files has been found in the current workspace');
      return null;
    }

    const comments: Comment[] = [];

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


      commentsArr.push({
        type,
        priority,
        text: match[0],
        filePath: filePath.path,
        line: i + 1
      });
    }
  }
}