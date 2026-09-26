import * as vscode from 'vscode';
import { Comment } from '../interfaces';

export class CommentStorage {
  private readonly FIELD_KEY = 'comments';

  constructor(private readonly state: vscode.Memento) {}

  load(): Comment[] {
    return JSON.parse(this.state.get(this.FIELD_KEY, '[]'));
  }

  async save(comments: Comment[]) {
    await this.state.update(this.FIELD_KEY, JSON.stringify(comments));
  }
}