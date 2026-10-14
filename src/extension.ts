/**
 * ## `/extension.ts`
 * 
 * Главная точка входа плагина Todo Manager.
 * Отвечает за инициализацию жизненного цикла плагина и регистрацию UI-компонентов и пользовательских команд.
 *
 * ### Инициализируемые компоненты:
 * - {@link CommentScanner} — Объект для парсинга текстовых файлов на наличие комментариев.
 * - {@link CommentStorage} — Хранилище комментариев, используемое для синхронизации при запуске IDE.
 * - {@link CommentTreeView} — Компонент отрисовки дерева комментариев на боковой панели IDE.
 *
 * ### Регистрируемые команды:
 * - `todo-manager.scanWorkspace` — Поиск комментариев в текущем рабочем пространстве.
 * - `todo-manager.openComment` — Открытие файла с переходом на строку комментария.
 * - `todo-manager.deleteComment` — Физическое удаление строки с комментарием из файла.
 * - `todo-manager.removeComment` — Внутреннее удаление узла из хранилища и UI.
 *
 * @module core
 */

import * as vscode from 'vscode'

import { CommentStorage } from './entities/CommentStorage'
import { CommentScanner } from './entities/CommentScanner'
import { CommentTreeView, CommentNode } from './entities/CommentTreeView'

import { openCommentInEditor, deleteCommentFromFile } from './actions/comment'
import { updateDecorations } from './actions/decoration'

/**
 * Активирует расширение VS Code. Метод вызывается автоматически самой IDE,
 * когда триггерится одно из событий активации `activationEvents`, описанных в `package.json`.
 *
 * Выполняет инициализацию компонентов и регистрацию команд.
 * Подписывает события жизненного цикла на автоматическую очистку (`context.subscriptions`).
 *
 * @param context Контекст расширения, предоставляемый VS Code для управления состоянием и подписками
 */
export function activate(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration('todoManager')

  const scanner = new CommentScanner()
  const storage = new CommentStorage(context.workspaceState)
  const comments = storage.loadComments()

  const view = new CommentTreeView(comments, config.get<boolean>('showCommentGroupIcons', true))

  vscode.window.registerTreeDataProvider('todoManager', view)

  const scanWorkspaceCommand = vscode.commands.registerCommand(
    'todo-manager.scanWorkspace',

    async (): Promise<void> => {
      const comments = await scanner.scanWorkspace()
      await storage.updateComments(comments)

      view.updateTreeNodes(comments)
      view.refresh()
    }
  )

  const openCommentCommand = vscode.commands.registerCommand(
    'todo-manager.openComment',
    openCommentInEditor
  )

  const removeCommentCommand = vscode.commands.registerCommand(
    'todo-manager.removeComment',

    async (node: CommentNode): Promise<void> => {
      await storage.deleteComment(node.filename, node.line)

      view.deleteCommentNode(node)
      view.refresh()
    }
  )

  const deleteCommentCommand = vscode.commands.registerCommand(
    'todo-manager.deleteComment',

    async (node: CommentNode): Promise<void> => {
      try {
        await deleteCommentFromFile(node)
      } catch (e) {
        if (e instanceof Error) {
          vscode.window.showErrorMessage(e.message)
        }
        return
      }

      vscode.commands.executeCommand('todo-manager.removeComment', node)
    }
  )

  context.subscriptions.push(scanWorkspaceCommand)
  context.subscriptions.push(openCommentCommand)
  context.subscriptions.push(removeCommentCommand)
  context.subscriptions.push(deleteCommentCommand)

  if (config.get<boolean>('highlightComments', true)) {
    const changeTextDocEvent = vscode.workspace.onDidChangeTextDocument(updateDecorations)
    const changeActiveEditorEvent = vscode.window.onDidChangeActiveTextEditor(updateDecorations)

    context.subscriptions.push(changeTextDocEvent)
    context.subscriptions.push(changeActiveEditorEvent)
  }
}
