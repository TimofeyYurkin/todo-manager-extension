import * as vscode from 'vscode';
import * as path from 'path';

import { Comment, CommentType, PriorityLevel } from '../interfaces';

interface GroupNode {
  kind: 'group';
  label: string;
  children: FileNode[];
};

interface FileNode {
  kind: 'file';
  label: string;
  children: CommentNode[];
};

export interface CommentNode extends Comment {
  kind: 'comment';
  label: string;
};

type TreeNode = GroupNode | FileNode | CommentNode;
type EventItem = TreeNode | undefined | null | void;


/* Класс, описывающий UI-элемент VS Code Tree View, используемый для визуализации информации о найденных в файлах проекта комментариев */
export class CommentTreeView implements vscode.TreeDataProvider<TreeNode> {
  private static readonly _commentTypes: CommentType[] = ['TODO', 'FIX', 'BUG', 'NOTE'];

  private _onDidChangeTreeData: vscode.EventEmitter<EventItem> = new vscode.EventEmitter<EventItem>();
  private _rootNodes: GroupNode[] = [];

  readonly onDidChangeTreeData: vscode.Event<EventItem> = this._onDidChangeTreeData.event;

  /**
   * Создает сущность CommentTreeView с массивом _rootNodes.
   * _rootNodes - корневые узлы дерева TreeView, представляющие группы комментариев типов _commentTypes.
   *
   * @param {Comment[]} comments: массив комментариев, который будет представлен в конечном UI-элементе
   * @param {boolean} showIcons: флаг, отвечающий за отображение иконок для узлов TreeView
   */
  constructor(
    comments: Comment[], 
    private readonly showIcons: boolean
  ) {
    this.updateTreeNodes(comments);
  }

  /**
   * Метод, используемый VS Code для получения UI-представления узла node Tree View.
   * Создает и возвращает объект класса TreeItem, представляющий UI-элемент, описывающий узел node
   * 
   * @param {TreeNode} node: узел Tree View, UI-представление которого нужно получить
   * @returns {vscode.TreeItem}: объект класса TreeItem, представляющий UI-элемент, описывающий узел node
   */
  getTreeItem(node: TreeNode): CommentTreeItem {
    const item = new CommentTreeItem(
      node,
      this.showIcons
    );

    return item;
  }

  /**
   * Метод, используемый VS Code при отрисовке Tree View для получения дочерних узлов узла дерева / корневых узлов.
   * Возвращает дочерние узлы требуемого узла или корневые узлы
   *
   * @param {?(TreeNode | undefined)} node: узел, детей которого необходимо получить (если undefined - необходимы корневые узлы)
   * @returns {vscode.ProviderResult<TreeNode[]>}: массив дочерних узлов узла / корневые узлы
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
   * Полностью перезаписывает структуру узлов Tree View, используя данные о комментариях из переданного массива comments
   *
   * @param {Comment[]} comments: массив комментариев, который должен использоваться при перезаписи
   * @returns {void}
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
   * Удаляет узел комментария node из дерева узлов Tree View. 
   * Если этот узел был последним дочерним элементом узла файла, также удалит узел файла.
   * Если узел файла был последним дочерним элементом узла группы, также удалит узел группы.
   * 
   * @param {Comment} node: узел, который необходимо удалить
   * @returns {void}
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

  /** 
   * Тригеррит событие для изменения Tree View 
   * 
   * @returns {void}
  */
  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}

class CommentTreeItem extends vscode.TreeItem { 
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

  /**
   * Устанавливает иконку для сущности CommentTreeItem
   * 
   * @returns {void}
   */
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