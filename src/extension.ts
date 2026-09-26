import * as vscode from 'vscode';

import { CommentStorage } from './storage/CommentStorage';
import { CommentScanner } from './scanner/CommentScanner';
import { CommentTreeView } from './view/CommentTreeView';

export function activate(context: vscode.ExtensionContext) {
  const storage = new CommentStorage(context.workspaceState);
  const scanner = new CommentScanner();

  const comments = storage.load();
  const view = new CommentTreeView(comments);

  vscode.window.registerTreeDataProvider(
    'workspaceComments',
    view
  );

  const scanCommand = vscode.commands.registerCommand('todo-manager.scanWorkspace', async () => {
    const comments = await scanner.scanWorkspace();
    await storage.update(comments);

    view.updateCommentGroups(comments);
    view.refresh();
  })

  context.subscriptions.push(scanCommand);
}