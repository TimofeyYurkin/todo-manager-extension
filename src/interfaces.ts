export type CommentType = 'TODO' | 'FIX' | 'BUG' | 'NOTE';

export interface Comment {
  type: CommentType;
  priority: number;
  text: string;
  path: string;
  filename: string;
  line: number;
}