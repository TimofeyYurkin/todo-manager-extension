/** 
 * ## `/entities/CommentTreeView.ts`
 * 
 * Модуль, предоставляющий функционал для реализаций UI-элемента, оипсывающего структуру комментариев в рабочем пространстве проекта
 * 
 * @module
 */

import * as vscode from 'vscode';
import * as path from 'path';

import { Comment, CommentType } from '../interfaces';

/**
 * Представляет узел-группу в древовидной структуре `Tree View`.
 * Описывает одну из категорий комментариев, которые обрабатывает плагин
 */
export interface GroupNode {
  /* Фиксированный идентификатор типа узла */
  kind: 'group';
  /* Название узла, используемое в его UI-представлении */
  label: string;
  /* Массив файлов, в которых находятся комментарии определенной категории */
  children: FileNode[];
};

/**
 * Представляет узел-файл в древовидной структуре `Tree View`.
 * Описывает файл со связанными с ним комментариями определенной категории
 */
export interface FileNode {
  /* Фиксированный идентификатор типа узла */
  kind: 'file';
  /* Название узла, используемое в его UI-представлении */
  label: string;
  /* Массив комментариев определенной категории, связанных с этим файлом */
  children: CommentNode[];
};

/**
 * Представляет узел-комментарий в древовидной структуре `Tree View`.
 * Расширяет базовый интерфейс {@link Comment} дополнительными свойствами
 */
export interface CommentNode extends Comment {
  /* Фиксированный идентификатор типа узла */
  kind: 'comment';
  /* Название узла, используемое в его UI-представлении */
  label: string;
};

/**
 * Представляет общий узел-комментарий в древовидной структуре `TreeView` 
 * @ignore
 */
type TreeNode = GroupNode | FileNode | CommentNode;

/** 
 * Представляет UI-элемент, который необходимо обновить при активации соответствующеего события.
 * Если значение не определено - нужно обновить всё дерево целиком
 * @ignore
 */
type EventItem = TreeNode | undefined | null | void;


/** 
 * Класс, описывающий UI-представление деревьев связей между 
 * категориями комментариев, файлами и комментариями, находящимися в этих файлах 
 */
export class CommentTreeView implements vscode.TreeDataProvider<TreeNode> {
  /* Массив с существующими типами комментариев */
  private static readonly _commentTypes: CommentType[] = ['TODO', 'FIX', 'BUG', 'NOTE'];

  /* Объект для активации пользовательского события для обновления UI-представления */
  private _onDidChangeTreeData: vscode.EventEmitter<EventItem> = new vscode.EventEmitter<EventItem>();

  /* 
   * Массив корневых элементов деревьев, UI-представление которых нужно отображать.
   * Корневой элемент у дерева - это один из типов комментариев. 
   * Дочерние элементы корневого узла - файлы, в которых лежат комментарии данной категории.
   * Листья дерева - найденные в файлах комментарии.
  */
  private _rootNodes: GroupNode[] = [];

  /* Функция для подписки на событие обновления UI-представления дерева  */
  readonly onDidChangeTreeData: vscode.Event<EventItem> = this._onDidChangeTreeData.event;

  /**
   * Создает сущность `CommentTreeView`
   *
   * @param comments массив комментариев, который будет использоваться при построении деревьев
   * @param showGroupIcons флаг, отвечающий за отображение иконок для корневых узлов
   */
  constructor(
    comments: Comment[], 
    private readonly showGroupIcons: boolean
  ) {
    this.updateTreeNodes(comments);
  }

  /**
   * Метод, используемый VS Code для получения UI-представления узла дерева.
   * 
   * @param node узел, UI-представление которого нужно получить
   * @returns `TreeItem`, представляющий UI-элемент, описывающий требуемый узел
   */
  getTreeItem(node: TreeNode): CommentTreeItem {
    const item = new CommentTreeItem(
      node,
      this.showGroupIcons || node.kind !== 'group'
    );

    return item;
  }

  /**
   * Метод, используемый VS Code при отрисовке UI-представления для получения дочерних узлов определенного узла / корневых узлов.
   *
   * @param node узел, детей которого необходимо получить (если undefined - необходимы корневые узлы)
   * @returns `TreeNode[]` узла / корневые узлы
   */
  getChildren(node?: TreeNode): vscode.ProviderResult<TreeNode[]> {
    if (!node) {
      return this._rootNodes;
    }
    
    if (node.kind !== 'comment') {
      return node.children;
    }

    return [];
  }

  /**
   * Перезаписывает структуру узлов, используя данные о комментариях из переданного массива
   *
   * @param comments массив комментариев, который должен использоваться при перезаписи
   */
  updateTreeNodes(comments: Comment[]): void {
    this._rootNodes.length = 0;

    if (comments.length === 0) {
      return;
    }
    
    for (const type of CommentTreeView._commentTypes) {
      const commentsOfGroup = comments.filter(comment => comment.type === type);

      if (commentsOfGroup.length === 0) {
        continue;
      }

      const groupNode: GroupNode = {
        kind: 'group',
        label: type,
        children: []
      };

      const commentsByFiles = new Map<string, CommentNode[]>();

      for (const comment of commentsOfGroup) {
        const commentNode: CommentNode = {
          kind: 'comment',
          label: `line ${comment.line + 1}: ${comment.text}`,
          ...comment
        };
        
        if (!commentsByFiles.has(comment.filename)) {
          commentsByFiles.set(comment.filename, [commentNode,]);
        }
        else {
          commentsByFiles.get(comment.filename)!.push(commentNode);
        }
      }

      for (const [filename, nodes] of commentsByFiles.entries()) {
        const fileNode: FileNode = {
          kind: 'file',
          label: filename,
          children: nodes
        };

        groupNode.children.push(fileNode);
      }

      this._rootNodes.push(groupNode);
    }
  }

  /**
   * Удаляет узел комментария из дерева узлов. 
   * Если этот узел был последним дочерним элементом узла файла, также удалит узел файла.
   * Если узел файла был последним дочерним элементом узла группы, также удалит корневой узел группы.
   * 
   * @param node узел, который необходимо удалить
   */
  deleteCommentNode(node: CommentNode): void {
    const groupNodeIndex = this._rootNodes.findIndex(g => g.label === node.type);

    if (groupNodeIndex === -1) {
      return;
    }

    const groupNode = this._rootNodes[groupNodeIndex];
    const fileNodeIndex = groupNode.children.findIndex(f => f.label === node.filename);

    if (fileNodeIndex === -1) {
      return;
    }

    const fileNode = groupNode.children[fileNodeIndex];

    for (let i = 0; i < fileNode.children.length; i++) {
      const commentNode = fileNode.children[i];

      if (node.line === commentNode.line) {
        fileNode.children.splice(i, 1);
        break;
      }
    }

    if (fileNode.children.length === 0) {
      groupNode.children.splice(fileNodeIndex, 1);
    }

    if (groupNode.children.length === 0) {
      this._rootNodes.splice(groupNodeIndex, 1);
    }
  }

  /** Тригеррит событие для обновления UI-представления деревьев */
  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}


/** Класс, описывающий UI-представление конкретного узла `CommentTreeView` */
export class CommentTreeItem extends vscode.TreeItem { 
  /**
   * Создает сущность `CommentTreeItem`
   *
   * @param node узел, который описывает объект
   * @param setIcon флаг, отвечающий за добавление иконки к UI-представлению узла
   */
  constructor(
    public readonly node: TreeNode,
    setIcon: boolean
  ) {
    super(node.label, vscode.TreeItemCollapsibleState.None);

    this.contextValue = node.kind;

    if (node.kind === 'comment') {
      this.command = {
        title: 'Open comment',
        command: 'todo-manager.openComment',
        arguments: [this.node]
      };
    }
    else {
      this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    }

    if (setIcon) {
      this.setItemIcon();
    }
  }

  /* Устанавливает иконку для сущности `CommentTreeItem` */
  private setItemIcon(): void {
    let iconFilename = null;

    if (this.node.kind === 'comment') {
      iconFilename = `priority-${this.node.priority}.svg`;
    }
    else if (this.node.kind === 'file') {
      iconFilename = `file.svg`;
    }
    else {
      iconFilename = `${this.node.label}.svg`;
    }

    this.iconPath = {
      light: vscode.Uri.file(
        path.join(__dirname, '..', 'resources', this.node.kind !== 'comment' ? 'light' : '', iconFilename)
      ),
      dark: vscode.Uri.file(
        path.join(__dirname, '..', 'resources', this.node.kind !== 'comment' ? 'dark' : '', iconFilename)
      ),
    };
  }
}