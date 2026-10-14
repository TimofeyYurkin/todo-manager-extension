[TODO Manager](../modules.md) / entities/CommentStorage

## `/entities/CommentStorage.ts`

Модуль, предоставляющий функционал для хранения данных в локальном хранилище рабочего пространства IDE.

## Классы

### `CommentStorage`

Объявлено в: [entities/CommentStorage.ts:14](https://github.com/TimofeyYurkin/todo-manager-extension/blob/1daf422af5f5d09a905aa42519c2b9cdd8aeddf0/src/entities/CommentStorage.ts#L14)

Класс для взаимодействия с локальным хранилищем активного рабочего пространства.

### Методы
---

### `constructor`

```ts
new CommentStorage(state): CommentStorage;
```

Объявлено в: [entities/CommentStorage.ts:25](https://github.com/TimofeyYurkin/todo-manager-extension/blob/1daf422af5f5d09a905aa42519c2b9cdd8aeddf0/src/entities/CommentStorage.ts#L25)

Создает сущность `CommentStorage`

### Параметры

| Параметр | Тип | Описание |
| ------ | ------ | ------ |
| `state` | `Memento` | интерфейс VS Code API для работы с локальным хранилищем рабочего пространства |

### Возвращаемое значение

[`CommentStorage`](#commentstorage)

---

### `loadComments()`

```ts
loadComments(): Comment[];
```

Объявлено в: [entities/CommentStorage.ts:32](https://github.com/TimofeyYurkin/todo-manager-extension/blob/1daf422af5f5d09a905aa42519c2b9cdd8aeddf0/src/entities/CommentStorage.ts#L32)

Извлекает массив комментариев, лежащий в хранилище. Если таковых нет, вернет пустой массив

### Возвращаемое значение

[`Comment`](../interfaces.md#comment)[] массив комментариев, находящийся в хранилище.

--- 

### `updateComments()`

```ts
updateComments(comments): Promise<void>;
```

Объявлено в: [entities/CommentStorage.ts:41](https://github.com/TimofeyYurkin/todo-manager-extension/blob/1daf422af5f5d09a905aa42519c2b9cdd8aeddf0/src/entities/CommentStorage.ts#L41)

Сохраняет переданный массив комментариев в хранилище

### Параметры

| Параметр | Тип | Описание |
| ------ | ------ | ------ |
| `comments` | [`Comment`](../interfaces.md#comment)[] | массив комментариев, который необходимо сохранить |

---

### `deleteComment()`

```ts
deleteComment(filename, line): Promise<void>;
```

Объявлено в: [entities/CommentStorage.ts:51](https://github.com/TimofeyYurkin/todo-manager-extension/blob/1daf422af5f5d09a905aa42519c2b9cdd8aeddf0/src/entities/CommentStorage.ts#L51)

Удаляет комментарий из хранилище по связке значений названия файла `filename` и номера строки `line`

### Параметры

| Параметр | Тип | Описание |
| ------ | ------ | ------ |
| `filename` | `string` | название файла, в котором хранится комментарий |
| `line` | `number` | номер строки файла, на которой находится комментарий |
