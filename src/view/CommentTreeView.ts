import * as vscode from 'vscode';

import { Comment, CommentType } from '../interfaces';

type CommentTreeItem = CommentGroup | FileItem | CommentItem;
type EventItem = CommentTreeItem | undefined | null | void;

export class CommentTreeView implements vscode.TreeDataProvider<CommentTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<EventItem> = new vscode.EventEmitter<EventItem>();
  readonly onDidChangeTreeData: vscode.Event<EventItem> = this._onDidChangeTreeData.event;

  private readonly COMMENT_GROUPS: CommentGroup[] = [];
  private readonly COMMENT_TYPES: CommentType[] = ['TODO', 'FIX', 'BUG', 'NOTE'];

  constructor(comments: Comment[]) {
    this.updateCommentGroups(comments);
  }

  getTreeItem(element: CommentTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: CommentTreeItem | undefined): vscode.ProviderResult<CommentTreeItem[]> {
    if (!element) {
      return this.COMMENT_GROUPS;
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
    this.COMMENT_GROUPS.length = 0;
    
    for (const type of this.COMMENT_TYPES) {
      const groupComments = comments.filter(comment => comment.type === type);
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

      this.COMMENT_GROUPS.push(new CommentGroup(
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
  }
}

class FileItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly comments: CommentItem[]
  ) {
    super(label, collapsibleState);
  }
}

  class CommentItem extends vscode.TreeItem {
    constructor(
      public readonly collapsibleState: vscode.TreeItemCollapsibleState,
      comment: Comment
    ) {
      super(comment.text, collapsibleState);
      
      this.command = {
        command: 'vscode.open',
        title: 'Open comment',
        arguments: [
          vscode.Uri.file(comment.path),
          {
            selection: new vscode.Range(
              new vscode.Position(comment.line - 1, 0),
              new vscode.Position(comment.line - 1, 0)
            ),
            preserveFocus: false
          }
        ]
      }
    }
  }