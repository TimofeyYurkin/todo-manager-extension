import * as vscode from 'vscode';

import { CommentStorage } from './storage/CommentStorage';
import { CommentScanner } from './scanner/CommentScanner';
import { CommentTreeView, CommentItem } from './view/CommentTreeView';

import { openCommentInEditor, deleteCommentFromFile } from './actions/comment';
import { updateDecorations } from './actions/decoration';

export function activate(context: vscode.ExtensionContext) {
  const editor = vscode.window.activeTextEditor;
  const config = vscode.workspace.getConfiguration('todoManager');

  const highlightComments = !!config.get<boolean>('highlightComments');
  const showCommentGroupIcons = !!config.get<boolean>('showCommentGroupIcons');

  const storage = new CommentStorage(context.workspaceState);
  const scanner = new CommentScanner();

  const comments = storage.loadComments();
  const view = new CommentTreeView(comments, showCommentGroupIcons);

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

  if (!highlightComments) {
    return;
  }

  if (editor) {
    updateDecorations(editor);
  }

  const changeTextDocEvent = vscode.workspace.onDidChangeTextDocument((event) => {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      return;
    }

    if (event.document !== editor.document) {
      return;
    }

    updateDecorations(editor);
  });

  const changeActiveEditorEvent = vscode.window.onDidChangeActiveTextEditor((editor) => {
    if (editor) {
      updateDecorations(editor);
    }
  });

  context.subscriptions.push(changeTextDocEvent);
  context.subscriptions.push(changeActiveEditorEvent);
}