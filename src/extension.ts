import * as vscode from 'vscode';

import { CommentStorage } from './storage/CommentStorage';
import { CommentScanner } from './scanner/CommentScanner';

export function activate(context: vscode.ExtensionContext) {
  const storage = new CommentStorage(context.workspaceState);
  const scanner = new CommentScanner();

  const scanCommand = vscode.commands.registerCommand('todo-manager.scanWorkspace', async () => {
    const comments = await scanner.scanWorkspace();
    await storage.save(comments);
  })

  context.subscriptions.push(scanCommand);
}