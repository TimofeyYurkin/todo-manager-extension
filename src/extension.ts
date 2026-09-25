import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('todo-manager.testCommand', () => {
    vscode.window.showInformationMessage('Hello!');
  })

  context.subscriptions.push(disposable);
}