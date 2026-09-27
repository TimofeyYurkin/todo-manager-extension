import * as vscode from 'vscode';

import { Comment } from '../interfaces';

/* Класс для взаимодействия с локальным хранилищем текущего рабочего пространства */
export class CommentStorage {
  private readonly fieldKey = 'comments';

  /**
   * Создает сущность CommentStorage
   *
   * @param {vscode.Memento} state: интерфейс VS Code API для работы с хранилищем
   */
  constructor(private readonly state: vscode.Memento) {}

  /**
   * Возвращает массив комментариев из локального хранилища
   *
   * @returns {Comment[]}: массив комментариев из хранилища
   */
  loadComments(): Comment[] {
    return JSON.parse(this.state.get(this.fieldKey, '[]'));
  }

  /**
   * Обновляет значение массива комментариев, находящееся в локальном хранилище
   *
   * @param {Comment[]} comments: массив комментариев, который необходимо сохранить
   * @returns {Promise<void>} 
   */
  async updateComments(comments: Comment[]): Promise<void> {
    await this.state.update(this.fieldKey, JSON.stringify(comments));
  }

  /**
   * Удаляет комментарий из хранилища по связке значений: название файла и номер строки, где находится комментарий
   *
   * @param {string} filename: название файла, в котором хранится комментарий
   * @param {number} line: номер строки файла, на которой находится комментарий
   * @returns {Promise<void>} 
   */
  async deleteComment(filename: string, line: number): Promise<void> {
    const comments: Comment[] = JSON.parse(this.state.get(this.fieldKey, '[]'));

    await this.state.update(
      this.fieldKey,
      JSON.stringify(comments.filter(comment => comment.filename !== filename && comment.line !== line))
    );
  }
}