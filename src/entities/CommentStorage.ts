/** 
 * ## `/entities/CommentStorage.ts`
 * 
 * Модуль, предоставляющий функционал для хранения данных в локальном хранилище рабочего пространства IDE
 * 
 * @module
 */

import * as vscode from 'vscode';

import { Comment } from '../interfaces';

/** Класс для взаимодействия с локальным хранилищем активного рабочего пространства */
export class CommentStorage {
  /* Ключ, по которому будут храниться комментарии в хранилище */
  private readonly fieldKey = 'comments';

  /**
   * Создает сущность `CommentStorage`
   * 
   * @param state интерфейс VS Code API для работы с локальным хранилищем рабочего пространства
   */
  constructor(private readonly state: vscode.Memento) {}

  /**
   * Извлекает массив комментариев, лежащий в хранилище. Если таковых нет, вернет пустой массив
   *
   * @returns массив комментариев, находящийся в хранилище.
   */
  loadComments(): Comment[] {
    return JSON.parse(this.state.get(this.fieldKey, '[]'));
  }

  /**
   * Сохраняет переданный массив комментариев в хранилище
   *
   * @param comments массив комментариев, который необходимо сохранить
   */
  async updateComments(comments: Comment[]): Promise<void> {
    await this.state.update(this.fieldKey, JSON.stringify(comments));
  }

  /**
   * Удаляет комментарий из хранилище по связке значений названия файла `filename` и номера строки `line`
   *
   * @param filename название файла, в котором хранится комментарий
   * @param line номер строки файла, на которой находится комментарий
   */
  async deleteComment(filename: string, line: number): Promise<void> {
    const comments: Comment[] = JSON.parse(this.state.get(this.fieldKey, '[]'));

    await this.state.update(
      this.fieldKey,
      JSON.stringify(comments.filter(comment => comment.filename !== filename && comment.line !== line))
    );
  }
}