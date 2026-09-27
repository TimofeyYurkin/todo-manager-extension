import * as vscode from 'vscode';

import { CommentStorage } from './storage/CommentStorage';
import { CommentScanner } from './scanner/CommentScanner';
import { CommentTreeView, CommentItem } from './view/CommentTreeView';

export function activate(context: vscode.ExtensionContext) {
  const storage = new CommentStorage(context.workspaceState);
  const scanner = new CommentScanner();

  const comments = storage.loadComments();
  const view = new CommentTreeView(comments);

  vscode.window.registerTreeDataProvider(
    'todoManager',
    view
  );

  const scanCommand = vscode.commands.registerCommand(
    'todo-manager.scanWorkspace', 

    async () => {
      const comments = await scanner.scanWorkspace();
      await storage.updateComments(comments);

      view.updateCommentGroups(comments);
      view.refresh();
    }
  );

  const openCommentCommand = vscode.commands.registerCommand(
    'todo-manager.openComment',

    (item: CommentItem) => {
      vscode.commands.executeCommand(
        'vscode.open', 
        vscode.Uri.file(item.comment.path),
        {
          selection: new vscode.Range(
            new vscode.Position(item.comment.line, 0),
            new vscode.Position(item.comment.line, 0)
          ),
          preserveFocus: false
        }
      )
    }
  );

  const deleteCommentCommand = vscode.commands.registerCommand(
    'todo-manager.deleteComment',

    async (item: CommentItem) => {
      const fileUri = vscode.Uri.file(item.comment.path);
      let document = null;

      try {
        document = await vscode.workspace.openTextDocument(fileUri);
      }
      catch (e) {
        vscode.window.showErrorMessage(`Failed to open file ${item.comment.filename}`);
        return;
      }

      if (item.comment.line >= document.lineCount) {
        vscode.window.showErrorMessage(`Failed to find line ${item.comment.line + 1} in ${item.comment.filename}`);
        return;
      }

      const line = document.lineAt(item.comment.line);
      const containsComment = line.text.includes(item.comment.text) && line.text.includes(item.comment.type);

      if (!containsComment) {
        vscode.window.showErrorMessage(`Failed to find comment at line ${item.comment.line + 1} in ${item.comment.filename}`);
        return;
      }

      const edit = new vscode.WorkspaceEdit();

      edit.delete(
        fileUri,
        new vscode.Range(
          line.rangeIncludingLineBreak.start,
          line.rangeIncludingLineBreak.end
        )
      );

      await vscode.workspace.applyEdit(edit);
      await storage.deleteComment(item.comment.filename, item.comment.line);

      view.refresh();
    }
  );

  context.subscriptions.push(scanCommand);
  context.subscriptions.push(openCommentCommand);
  context.subscriptions.push(deleteCommentCommand);
}