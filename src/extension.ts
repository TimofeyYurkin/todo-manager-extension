import * as vscode from 'vscode';

import { CommentStorage } from './storage/CommentStorage';
import { CommentScanner } from './scanner/CommentScanner';
import { CommentTreeView, CommentItem } from './view/CommentTreeView';

import { openCommentInEditor, deleteCommentFromFile } from './actions/comment';

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

  const openCommentCommand = vscode.commands.registerCommand('todo-manager.openComment', openCommentInEditor);

  const removeCommentCommand = vscode.commands.registerCommand(
    'todo-manager.removeComment',

    async (item: CommentItem) => {
      await storage.deleteComment(item.comment.filename, item.comment.line);
      view.deleteCommentItem(item.comment);
      view.refresh();
    } 
  );

  const deleteCommentCommand = vscode.commands.registerCommand(
    'todo-manager.deleteComment',

    async (item: CommentItem) => {
      try {
        await deleteCommentFromFile(item);
      }
      catch (e) {
        if (e instanceof Error) {
          vscode.window.showErrorMessage(e.message);
        }
        return;
      }
      
      vscode.commands.executeCommand('todo-manager.removeComment', item);
    }
  );

  context.subscriptions.push(scanCommand);
  context.subscriptions.push(openCommentCommand);
  context.subscriptions.push(removeCommentCommand);
  context.subscriptions.push(deleteCommentCommand);
}