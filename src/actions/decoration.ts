import * as vscode from 'vscode';

import { CommentType } from '../interfaces';

const commentTypes: CommentType[] = ['TODO', 'FIX', 'BUG', 'NOTE'];

const basicDecoration: vscode.DecorationRenderOptions = {
  'fontStyle': 'italic'
};

const commentDecorationTypes: Record<CommentType, vscode.TextEditorDecorationType> = {
  'TODO': vscode.window.createTextEditorDecorationType({
    ...basicDecoration,
    color: 'rgba(169, 217, 106, 1)'
  }),

  'FIX': vscode.window.createTextEditorDecorationType({
    ...basicDecoration,
    color: 'rgb(90, 191, 227)'
  }),

  'BUG': vscode.window.createTextEditorDecorationType({
    ...basicDecoration,
    color: 'rgb(232, 113, 102)'
  }),

  'NOTE': vscode.window.createTextEditorDecorationType({
    ...basicDecoration,
    color: 'rgb(168, 92, 227)'
  })
}

/**
 * Применяет декорирование к комментариям в текущем активном редакторе
 *
 * @param {vscode.TextEditor} editor: объект текущего активного редактора
 */
export function updateDecorations(editor: vscode.TextEditor) {
  const decorations: Record<CommentType, vscode.DecorationOptions[]> = {
    'TODO': [],
    'FIX': [],
    'BUG': [],
    'NOTE': []
  }

  for (let i = 0; i < editor.document.lineCount; i++) {
    const line = editor.document.lineAt(i);

    for (const type of commentTypes) {
      if (!line.text.includes(`${type}:`)) {
        continue;
      }
      decorations[type].push({ range: line.range });
    }
  }

  for (const type of commentTypes) {
    editor.setDecorations(commentDecorationTypes[type], decorations[type]);
  }
}
