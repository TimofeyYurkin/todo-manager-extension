export type CommentType = 'TODO' | 'FIX' | 'BUG' | 'NOTE';
export type PriorityLevel = 1 | 2 | 3;

export interface CommentBase {
  type: CommentType;
  priority: PriorityLevel;
  text: string;
}

export interface Comment extends CommentBase {
  path: string;
  filename: string;
  line: number;
}