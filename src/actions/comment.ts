import * as vscode from 'vscode';

import { CommentNode } from '../view/CommentTreeView';

/**
 * Открывает файл в редакторе и фокусирует курсор на строке с комментарием, связанного с узлом node
 *
 * @param {CommentNode} node: узел комментария, который нужно открыть
 */
export function openCommentInEditor(node: CommentNode): void {
  vscode.commands.executeCommand(
    'vscode.open', 
    vscode.Uri.file(node.path),
    {
      selection: new vscode.Range(
        new vscode.Position(node.line, 0),
        new vscode.Position(node.line, 0)
      ),
      preserveFocus: false
    }
  );
};

/**
 * Удаляет строчку с комментарием, связанным с узлом node, из файла
 *
 * @param {CommentNode} node: узел комментария, который нужно удалить
 * @throws {Error}: выбрасывает исключение, если комментарий нельзя найти по к-л причине
 */
export async function deleteCommentFromFile(node: CommentNode): Promise<void> {
  const fileUri = vscode.Uri.file(node.path);
  let document = null;

  try {
    document = await vscode.workspace.openTextDocument(fileUri);
  }
  catch (e) {
    throw new Error(`Failed to open file ${node.filename}`);
  }

  if (node.line >= document.lineCount) {
    throw new Error(`Failed to find line ${node.line + 1} in ${node.filename}`);
  }

  const line = document.lineAt(node.line);
  const containsComment = line.text.includes(node.text) && line.text.includes(node.type);

  if (!containsComment) {
    throw new Error(`Failed to find comment at line ${node.line + 1} in ${node.filename}`);
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
};