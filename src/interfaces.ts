export type CommentType = 'TODO' | 'FIX' | 'BUG' | 'NOTE';

export interface Comment {
  type: CommentType;
  priority: number;
  text: string;
  filePath: string;
  line: number;
}