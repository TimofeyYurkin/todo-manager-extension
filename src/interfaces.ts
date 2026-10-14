/** ## `/interfaces.ts` */

/** Описывает существующие типы комментариев */
export type CommentType = 'TODO' | 'FIX' | 'BUG' | 'NOTE';

/** Описывает существующие уровни приоритета (важности) комментариев.
 * 1 - низший уровень приоритета, 3 - высший уровень приоритета
 */
export type PriorityLevel = 1 | 2 | 3;

/** Описывает базовую информацию о комментарии */
export interface CommentBase {
  /* Тип комментария */
  type: CommentType;
  /* Приоритетность комментария */
  priority: PriorityLevel;
  /* Текст комментария */
  text: string;
}

/**
 * Описываю полную информацию о комментарии.
 * Расширяет интерфейс {@link CommentBase}
 */
export interface Comment extends CommentBase {
  /* Путь до файла, в котором хранится комментарий */
  path: string;
  /* Имя файла, в котором хранится комментарий */
  filename: string;
  /* Строка в файле, на которой находится комментарий */
  line: number;
}