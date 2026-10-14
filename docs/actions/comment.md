[TODO Manager](../modules.md) / actions/comment

## `/actions/comment.ts`

Модуль, предоставляющий функции для физического взаимодействия с комментариями,
связанных с узлами [CommentNode](../entities/CommentTreeView.md#commentnode) UI-компонента 
[CommentTreeView](../entities/CommentTreeView.md#commenttreeview), в текстовом редакторе IDE.

## Функции

### `openCommentInEditor()`

```ts
function openCommentInEditor(node): void;
```

Объявлено в: [actions/comment.ts:21](https://github.com/TimofeyYurkin/todo-manager-extension/blob/1daf422af5f5d09a905aa42519c2b9cdd8aeddf0/src/actions/comment.ts#L21)

Открывает текстовый файл, в котором лежит комментарий, связанный с узлом `node`,
в области редактора IDE и фокусирует курсор на начале строки с данным комментарием.

### Параметры

| Параметр | Тип | Описание |
| ------ | ------ | ------ |
| `node` | [`CommentNode`](../entities/CommentTreeView.md#commentnode) | узел, связанный с комментарием, на который нужно поставить фокус
---

### `deleteCommentFromFile()`

```ts
function deleteCommentFromFile(node): Promise<void>;
```

Объявлено в: [actions/comment.ts:43](https://github.com/TimofeyYurkin/todo-manager-extension/blob/1daf422af5f5d09a905aa42519c2b9cdd8aeddf0/src/actions/comment.ts#L43)

Удаляет из текстового файла строку с комментарием, связанного с узлом `node`.

### Параметры 

| Параметр | Тип | Описание |
| ------ | ------ | ------ |
| `node` | [`CommentNode`](../entities/CommentTreeView.md#commentnode) | узел, связанный с комментарием, который нужно удалить |
|
### Исключения

`Error`, если комментарий невозможно удалить по одной из следующих причин:

1. Невозможно найти открыть файл по пути `node.path` с именем `node.filename`

2. Количество строк в файле меньше номера строки, на которой находится комментарий

3. На строке, где предположительно должен быть комментарий, его нет
