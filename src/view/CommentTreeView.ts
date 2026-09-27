import * as vscode from 'vscode';
import * as path from 'path';

import { Comment, CommentType } from '../interfaces';

type CommentTreeItem = CommentGroup | FileItem | CommentItem;
type EventItem = CommentTreeItem | undefined | null | void;

export class CommentTreeView implements vscode.TreeDataProvider<CommentTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<EventItem> = new vscode.EventEmitter<EventItem>();
  readonly onDidChangeTreeData: vscode.Event<EventItem> = this._onDidChangeTreeData.event;

  private _commentGroups: CommentGroup[] = [];
  private readonly _commentTypes: CommentType[] = ['TODO', 'FIX', 'BUG', 'NOTE'];

  constructor(comments: Comment[]) {
    this.updateCommentGroups(comments);
  }

  getTreeItem(element: CommentTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: CommentTreeItem | undefined): vscode.ProviderResult<CommentTreeItem[]> {
    if (!element) {
      return this._commentGroups;
    }
    
    if (element instanceof CommentGroup) {
      return element.files;
    }

    if (element instanceof FileItem) {
      return element.comments;
    }

    return [];
  }

  updateCommentGroups(comments: Comment[]) {
    this._commentGroups.length = 0;

    if (comments.length === 0) {
      return;
    }
    
    for (const type of this._commentTypes) {
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

      this._commentGroups.push(new CommentGroup(
        type,
        vscode.TreeItemCollapsibleState.Collapsed,
        fileItems
      ));
    }
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}

class CommentGroup extends vscode.TreeItem {
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

class FileItem extends vscode.TreeItem {
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

export class CommentItem extends vscode.TreeItem {
  constructor(
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly comment: Comment
  ) {
    super(comment.text, collapsibleState);
    
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