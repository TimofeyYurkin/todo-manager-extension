import * as vscode from 'vscode';
import * as path from 'path';

import { Comment, CommentType } from '../interfaces';

type CommentTreeItem = CommentGroup | FileItem | CommentItem;
type EventItem = CommentTreeItem | undefined | null | void;


/* Класс, описывающий VS Code Tree View для визуализации информации о найденных комментариях */
export class CommentTreeView implements vscode.TreeDataProvider<CommentTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<EventItem> = new vscode.EventEmitter<EventItem>();
  readonly onDidChangeTreeData: vscode.Event<EventItem> = this._onDidChangeTreeData.event;

  private commentGroups: CommentGroup[] = [];
  private readonly commentTypes: CommentType[] = ['TODO', 'FIX', 'BUG', 'NOTE'];

  /**
   * Создает сущность CommentTreeView
   *
   * @param {Comment[]} comments: массив комментариев, который будет представлен в Tree View
   */
  constructor(comments: Comment[]) {
    this.updateCommentGroups(comments);
  }

  /**
   * Метод, используемый VS Code для получения информации о конкретном элементе Tree View
   * 
   * @param {CommentTreeItem} element: элемент Tree View
   * @returns {vscode.TreeItem}: элемент Tree View
   */
  getTreeItem(element: CommentTreeItem): vscode.TreeItem {
    return element;
  }

  /**
   * Метод, используемый VS Code для получения всех детей конкретного элемента Tree View
   *
   * @param {?(CommentTreeItem | undefined)} [element]: элемент, детей которого нужно получить (если undefined - нужны дети корневого элемента)
   * @returns {vscode.ProviderResult<CommentTreeItem[]>}: массив элементов Tree View
   */
  getChildren(element?: CommentTreeItem | undefined): vscode.ProviderResult<CommentTreeItem[]> {
    if (!element) {
      return this.commentGroups;
    }
    
    if (element instanceof CommentGroup) {
      return element.files;
    }

    if (element instanceof FileItem) {
      return element.comments;
    }

    return [];
  }

  /**
   * Полностью перезаписывает структуру Tree View переданным массивом комментариев
   *
   * @param {Comment[]} comments: массив комментариев, который должен использоваться при перезаписи
   */
  updateCommentGroups(comments: Comment[]) {
    this.commentGroups.length = 0;

    if (comments.length === 0) {
      return;
    }
    
    for (const type of this.commentTypes) {
      const groupComments = comments.filter(comment => comment.type === type);

      if (groupComments.length === 0) {
        continue;
      }

      const commentsByFiles = new Map<string, CommentItem[]>();

      for (const comment of groupComments) {
        const item = new CommentItem(
          vscode.TreeItemCollapsibleState.None,
          comment
        );
        
        if (!commentsByFiles.has(comment.filename)) {
          commentsByFiles.set(comment.filename, [item,]);
        }
        else {
          commentsByFiles.get(comment.filename)?.push(item);
        }
      }

      const fileItems = [];

      for (const [filename, items] of commentsByFiles.entries()) {
        fileItems.push(new FileItem(
          filename,
          vscode.TreeItemCollapsibleState.Collapsed,
          items
        ))
      }

      this.commentGroups.push(new CommentGroup(
        type,
        vscode.TreeItemCollapsibleState.Collapsed,
        fileItems
      ));
    }
  }

  /**
   * Удаляет UI элемент комментария из Tree View.
   * При необходимости также удаляет элементы файла и группы
   * 
   * @param {Comment} comment: комментарий, который необходимо удалить
   */
  deleteCommentItem(comment: Comment) {
    const groupIndex = this.commentGroups.findIndex(g => g.label === comment.type);

    if (groupIndex === -1) {
      return;
    }

    const groupItem = this.commentGroups[groupIndex];
    const fileIndex = groupItem.files.findIndex(f => f.label === comment.filename);

    if (fileIndex === -1) {
      return;
    }

    const fileItem = groupItem.files[fileIndex];

    for (let i = 0; i < fileItem.comments.length; i++) {
      const commentItem = fileItem.comments[i];

      if (comment.line === commentItem.comment.line) {
        fileItem.comments.splice(i, 1);
        break;
      }
    }

    if (fileItem.comments.length === 0) {
      groupItem.files.splice(fileIndex, 1);
    }

    if (groupItem.files.length === 0) {
      this.commentGroups.splice(groupIndex, 1);
    }
  }

  /* Тригеррит событие для изменения Tree View */
  refresh() {
    this._onDidChangeTreeData.fire();
  }
}


/* Класс, описывающий UI элемента Tree view, представлящего группу комментариев */
class CommentGroup extends vscode.TreeItem {
  /**
   * Создает сущность CommentGroup
   *
   * @param {string} label: название группы 
   * @param {vscode.TreeItemCollapsibleState} collapsibleState: состояние сворачиваемости 
   * @param {FileItem[]} files: массив UI элементов файлов, являющихся детьми этой группы 
   */
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly files: FileItem[]
  ) {
    super(label, collapsibleState);

    this.iconPath = {
      light: vscode.Uri.file(
        path.join(__dirname, '..', 'resources', 'light', `${this.label}.svg`)
      ),
      dark: vscode.Uri.file(
        path.join(__dirname, '..', 'resources', 'dark', `${this.label}.svg`)
      ),
    };
  }
}


/* Класс, описывающий UI элемента Tree View, представляющего файл, в к-ом находятся комментарии */
class FileItem extends vscode.TreeItem {
  /**
   * Создает сущность FileItem
   *
   * @param {string} label: название файла
   * @param {vscode.TreeItemCollapsibleState} collapsibleState: состояние сворачиваемости
   * @param {CommentItem[]} comments: массив элементов комментариев, принадлежащих этому файлу
   */
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly comments: CommentItem[]
  ) {
    super(label, collapsibleState);

    this.iconPath = {
      light: vscode.Uri.file(
        path.join(__dirname, '..', 'resources', 'light', 'file.svg')
      ),
      dark: vscode.Uri.file(
        path.join(__dirname, '..', 'resources', 'dark', 'file.svg')
      )
    };
  }
}

/* Класс, описывающий UI элемента Tree View, представляющего комментарий */
export class CommentItem extends vscode.TreeItem {
  /**
   * Создает сущность CommentItem
   * 
   * @param {vscode.TreeItemCollapsibleState} collapsibleState: состояние сворачиваемости
   * @param {Comment} comment: комментарий, связанный с данным UI элементом
   */
  constructor(
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly comment: Comment
  ) {
    const label = `line ${comment.line + 1}: ${comment.text}`;

    super(label, collapsibleState);
    
    this.contextValue = 'comment';

    this.command = {
      command: 'todo-manager.openComment',
      title: 'Open comment',
      arguments: [this]
    };

    this.iconPath = {
      light: vscode.Uri.file(
        path.join(__dirname, '..', 'resources', `priority-${comment.priority}.svg`)
      ),
      dark: vscode.Uri.file(
        path.join(__dirname, '..', 'resources', `priority-${comment.priority}.svg`)
      )
    };
  }
}
