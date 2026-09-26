import * as vscode from 'vscode';
import { CommentScanner } from './scanner/CommentScanner';

export function activate(context: vscode.ExtensionContext) {
  const scanner = new CommentScanner();

  const scanCommand = vscode.commands.registerCommand('todo-manager.scanWorkspace', async () => {
    const comments = await scanner.scanWorkspace();
  })

  context.subscriptions.push(scanCommand);
}