/**
 * ## `/actions/comment.ts`
 *
 * Модуль, предоставляющий функции для физического взаимодействия с комментариями,
 * связанных с узлами {@link CommentNode} UI-компонента {@link CommentTreeView},
 * в текстовом редакторе IDE.
 *
 * @module
 */

import * as vscode from 'vscode'

import { CommentNode } from '../entities/CommentTreeView'

/**
 * Открывает текстовый файл, в котором лежит комментарий, связанный с узлом `node`,
 * в области редактора IDE и фокусирует курсор на начале строки с данным комментарием.
 *
 * @param node узел, связанный с комментарием, на который нужно поставить фокус
 */
export function openCommentInEditor(node: CommentNode): void {
  vscode.commands.executeCommand('vscode.open', vscode.Uri.file(node.path), {
    selection: new vscode.Range(
      new vscode.Position(node.line, 0),
      new vscode.Position(node.line, 0)
    ),
    preserveFocus: false
  })
}

/**
 * Удаляет из текстового файла строку с комментарием, связанного с узлом `node`.
 *
 * @param node узел, связанный с комментарием, который нужно удалить
 * @throws `Error`, если комментарий невозможно удалить по одной из следующих причин:
 *
 * 1. Невозможно найти открыть файл по пути `node.path` с именем `node.filename`
 *
 * 2. Количество строк в файле меньше номера строки, на которой находится комментарий
 *
 * 3. На строке, где предположительно должен быть комментарий, его нет
 */
export async function deleteCommentFromFile(node: CommentNode): Promise<void> {
  const fileUri = vscode.Uri.file(node.path)
  let document = null

  try {
    document = await vscode.workspace.openTextDocument(fileUri)
  } catch (e) {
    throw new Error(`Failed to open file ${node.filename}`)
  }

  if (node.line >= document.lineCount) {
    throw new Error(`Failed to find line ${node.line + 1} in ${node.filename}`)
  }

  const line = document.lineAt(node.line)

  if (line.text.includes(node.text) && line.text.includes(node.type)) {
    throw new Error(`Failed to find comment at line ${node.line + 1} in ${node.filename}`)
  }

  const edit = new vscode.WorkspaceEdit()

  edit.delete(
    fileUri,
    new vscode.Range(line.rangeIncludingLineBreak.start, line.rangeIncludingLineBreak.end)
  )

  await vscode.workspace.applyEdit(edit)
}
