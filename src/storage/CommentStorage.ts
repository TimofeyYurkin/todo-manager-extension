import * as vscode from 'vscode';

import { Comment } from '../interfaces';

/* Класс, реализующий логику взаимодействия с локальным хранилищем текущего рабочего пространства */
export class CommentStorage {
  private readonly fieldKey = 'comments';

  /**
   * Создает сущность CommentStorage
   *
   * @param {vscode.Memento} state: интерфейс VS Code API для работы с локальным хранилищем рабочего пространства
   */
  constructor(private readonly state: vscode.Memento) {}

  /**
   * Возвращает массив комментариев, хранящихся в локальном хранилище рабочего пространства
   *
   * @returns {Comment[]}: массив комментариев, хранящийся в локальном хранилище рабочего пространства
   */
  loadComments(): Comment[] {
    return JSON.parse(this.state.get(this.fieldKey, '[]'));
  }

  /**
   * Сохраняет массив переданных комментариев comments в локальное хранилище рабочего пространства проекта
   *
   * @param {Comment[]} comments: массив комментариев, который необходимо сохранить
   * @returns {Promise<void>} 
   */
  async updateComments(comments: Comment[]): Promise<void> {
    await this.state.update(this.fieldKey, JSON.stringify(comments));
  }

  /**
   * Удаляет комментарий из массива комментариев, находящегося в локальном хранилище рабочего пространства,
   * по связке значений названия файла filename и номера строки line, где находится комментарий
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