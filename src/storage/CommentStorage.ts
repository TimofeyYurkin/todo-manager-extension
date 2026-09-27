import * as vscode from 'vscode';
import { Comment } from '../interfaces';

export class CommentStorage {
  private readonly FIELD_KEY = 'comments';

  constructor(private readonly state: vscode.Memento) {}

  loadComments(): Comment[] {
    return JSON.parse(this.state.get(this.FIELD_KEY, '[]'));
  }

  async updateComments(comments: Comment[]): Promise<void> {
    await this.state.update(this.FIELD_KEY, JSON.stringify(comments));
  }

  async deleteComment(filename: string, line: number): Promise<void> {
    const comments: Comment[] = JSON.parse(this.state.get(this.FIELD_KEY, '[]'));

    await this.state.update(
      this.FIELD_KEY,
      JSON.stringify(comments.filter(comment => comment.filename !== filename && comment.line !== line))
    );
  }
}