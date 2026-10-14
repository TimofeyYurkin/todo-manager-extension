[TODO Manager](../modules.md) / entities/CommentScanner

## `/entities/CommentScanner.ts`

Модуль, предоставляющий функционал для анализа текстовых файлов активного рабочего пространства в IDE
и для парсинга найденных комментариев, с которыми работает плагин.

## Классы

### `CommentScanner`

Объявлено в: [entities/CommentScanner.ts:19](https://github.com/TimofeyYurkin/todo-manager-extension/blob/1daf422af5f5d09a905aa42519c2b9cdd8aeddf0/src/entities/CommentScanner.ts#L19)

Класс для анализа текстовых файлов активного рабочего пространства на наличие комментариев
и для парсинга найденных комментариев

### Методы
---

### `constructor`

```ts
new CommentScanner(): CommentScanner;
```

Объявлено в: [entities/CommentScanner.ts:24](https://github.com/TimofeyYurkin/todo-manager-extension/blob/1daf422af5f5d09a905aa42519c2b9cdd8aeddf0/src/entities/CommentScanner.ts#L24)

### Возвращаемое значение

[`CommentScanner`](#commentscanner)

---

### `scanWorkspace()`

```ts
scanWorkspace(): Promise<Comment[]>;
```

Объявлено в: [entities/CommentScanner.ts:32](https://github.com/TimofeyYurkin/todo-manager-extension/blob/1daf422af5f5d09a905aa42519c2b9cdd8aeddf0/src/entities/CommentScanner.ts#L32)

Анализирует текстовые файлы активного рабочего пространства на наличие комментариев.
Найденные комментарии обрабатываются приватным методом-парсером.

### Возвращаемое значение

`Promise`\<[`Comment`](../interfaces.md#comment)[]\> массив найденных обработанных комментариев
