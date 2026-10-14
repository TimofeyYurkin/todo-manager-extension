[TODO Manager](modules.md) / core

## `/extension.ts`

Главная точка входа плагина Todo Manager.
Отвечает за инициализацию жизненного цикла плагина и регистрацию UI-компонентов и пользовательских команд.

### Инициализируемые компоненты:
- [CommentScanner](entities/CommentScanner.md#commentscanner) — Объект для парсинга текстовых файлов на наличие комментариев.
- [CommentStorage](entities/CommentStorage.md#commentstorage) — Хранилище комментариев, используемое для синхронизации при запуске IDE.
- [CommentTreeView](entities/CommentTreeView.md#commenttreeview) — Компонент отрисовки дерева комментариев на боковой панели IDE.

### Регистрируемые команды:
- `todo-manager.scanWorkspace` — Поиск комментариев в текущем рабочем пространстве.
- `todo-manager.openComment` — Открытие файла с переходом на строку комментария.
- `todo-manager.deleteComment` — Физическое удаление строки с комментарием из файла.
- `todo-manager.removeComment` — Внутреннее удаление узла из хранилища и UI.

## Функции

### `activate()`

```ts
function activate(context): void;
```

Объявлено в: [extension.ts:38](https://github.com/TimofeyYurkin/todo-manager-extension/blob/1daf422af5f5d09a905aa42519c2b9cdd8aeddf0/src/extension.ts#L38)

Активирует расширение VS Code. Метод вызывается автоматически самой IDE,
когда триггерится одно из событий активации `activationEvents`, описанных в `package.json`.

Выполняет инициализацию компонентов и регистрацию команд.
Подписывает события жизненного цикла на автоматическую очистку (`context.subscriptions`).

### Параметры

| Параметр | Тип | Описание |
| ------ | ------ | ------ |
| `context` | `ExtensionContext` | Контекст расширения, предоставляемый VS Code для управления состоянием и подписками |
