import * as vscode from 'vscode';

import { CommentItem } from '../view/CommentTreeView';

/**
 * Открывает файл в редакторе и фокусирует курсор на строке с комментарием
 *
 * @param {CommentItem} item: комментарий, который нужно открыть
 */
export function openCommentInEditor(item: CommentItem) {
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
  );
};

/**
 * Удаляет строчку с комментарием из файла
 *
 * @param {CommentItem} item: комментарий, который нужно удалить
 * @throws {Error}: выбрасывает исключение, если комментарий нельзя найти по к-л причине
 */
export async function deleteCommentFromFile(item: CommentItem) {
  const fileUri = vscode.Uri.file(item.comment.path);
  let document = null;

  try {
    document = await vscode.workspace.openTextDocument(fileUri);
  }
  catch (e) {
    throw new Error(`Failed to open file ${item.comment.filename}`);
  }

  if (item.comment.line >= document.lineCount) {
    throw new Error(`Failed to find line ${item.comment.line + 1} in ${item.comment.filename}`);
  }

  const line = document.lineAt(item.comment.line);
  const containsComment = line.text.includes(item.comment.text) && line.text.includes(item.comment.type);

  if (!containsComment) {
    throw new Error(`Failed to find comment at line ${item.comment.line + 1} in ${item.comment.filename}`);
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