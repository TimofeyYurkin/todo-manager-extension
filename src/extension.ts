import * as vscode from 'vscode';

import { CommentStorage } from './storage/CommentStorage';
import { CommentScanner } from './scanner/CommentScanner';
import { CommentTreeView, CommentNode } from './view/CommentTreeView';

import { openCommentInEditor, deleteCommentFromFile } from './actions/comment';
import { updateDecorations } from './actions/decoration';

export function activate(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration('todoManager');

  const scanner = new CommentScanner();
  const storage = new CommentStorage(context.workspaceState);
  const comments = storage.loadComments();

  const view = new CommentTreeView(comments, config.get<boolean>('showCommentGroupIcons', true));

  vscode.window.registerTreeDataProvider('todoManager', view);

  const scanWorkspaceCommand = vscode.commands.registerCommand(
    'todo-manager.scanWorkspace', 

    async (): Promise<void> => {
      const comments = await scanner.scanWorkspace();
      await storage.updateComments(comments);

      view.updateTreeNodes(comments);
      view.refresh();
    }
  );

  const openCommentCommand = vscode.commands.registerCommand('todo-manager.openComment', openCommentInEditor);

  const removeCommentCommand = vscode.commands.registerCommand(
    'todo-manager.removeComment',

    async (node: CommentNode): Promise<void> => {
      await storage.deleteComment(node.filename, node.line);

      view.deleteCommentNode(node);
      view.refresh();
    } 
  );

  const deleteCommentCommand = vscode.commands.registerCommand(
    'todo-manager.deleteComment',

    async (node: CommentNode): Promise<void> => {
      try {
        await deleteCommentFromFile(node);
      }
      catch (e) {
        if (e instanceof Error) {
          vscode.window.showErrorMessage(e.message);
        }
        return;
      }
      
      vscode.commands.executeCommand('todo-manager.removeComment', node);
    }
  );

  context.subscriptions.push(scanWorkspaceCommand);
  context.subscriptions.push(openCommentCommand);
  context.subscriptions.push(removeCommentCommand);
  context.subscriptions.push(deleteCommentCommand);

  if (config.get<boolean>('highlightComments', true)) {
    const changeTextDocEvent = vscode.workspace.onDidChangeTextDocument(updateDecorations);
    const changeActiveEditorEvent = vscode.window.onDidChangeActiveTextEditor(updateDecorations);
    
    context.subscriptions.push(changeTextDocEvent);
    context.subscriptions.push(changeActiveEditorEvent);
  }
}