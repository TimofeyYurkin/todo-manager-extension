[TODO Manager](../modules.md) / entities/CommentTreeView

## `/entities/CommentTreeView.ts`

Модуль, предоставляющий функционал для реализаций UI-элемента, оипсывающего структуру комментариев в рабочем пространстве проекта.

## Классы

### `CommentTreeView`

Объявлено в: [entities/CommentTreeView.ts:61](https://github.com/TimofeyYurkin/todo-manager-extension/blob/1daf422af5f5d09a905aa42519c2b9cdd8aeddf0/src/entities/CommentTreeView.ts#L61)

Класс, описывающий UI-представление деревьев связей между 
категориями комментариев, файлами и комментариями, находящимися в этих файлах

### Методы

---

### `constructor`

```ts
new CommentTreeView(comments, showGroupIcons): CommentTreeView;
```

Объявлено в: [entities/CommentTreeView.ts:85](https://github.com/TimofeyYurkin/todo-manager-extension/blob/1daf422af5f5d09a905aa42519c2b9cdd8aeddf0/src/entities/CommentTreeView.ts#L85)

Создает сущность `CommentTreeView`

### Параметры

| Параметр | Тип | Описание |
| ------ | ------ | ------ |
| `comments` | [`Comment`](../interfaces.md#comment)[] | массив комментариев, который будет использоваться при построении деревьев |
| `showGroupIcons` | `boolean` | флаг, отвечающий за отображение иконок для корневых узлов |

### Возвращаемое значение

[`CommentTreeView`](#commenttreeview)

---

### `getTreeItem()`

```ts
getTreeItem(node): CommentTreeItem;
```

Объявлено в: [entities/CommentTreeView.ts:98](https://github.com/TimofeyYurkin/todo-manager-extension/blob/1daf422af5f5d09a905aa42519c2b9cdd8aeddf0/src/entities/CommentTreeView.ts#L98)

Метод, используемый VS Code для получения UI-представления узла дерева.

### Параметры

| Параметр | Тип | Описание |
| ------ | ------ | ------ |
| `node` | `TreeNode` | узел, UI-представление которого нужно получить |

### Возвращаемое значение

[`CommentTreeItem`](#commenttreeitem), представляющий UI-элемент, описывающий требуемый узел

---

### `getChildren()`

```ts
getChildren(node?): ProviderResult<TreeNode[]>;
```

Объявлено в: [entities/CommentTreeView.ts:113](https://github.com/TimofeyYurkin/todo-manager-extension/blob/1daf422af5f5d09a905aa42519c2b9cdd8aeddf0/src/entities/CommentTreeView.ts#L113)

Метод, используемый VS Code при отрисовке UI-представления для получения дочерних узлов определенного узла / корневых узлов.

### Параметры

| Parameter | Тип | Описание |
| ------ | ------ | ------ |
| `node?` | `TreeNode` | узел, детей которого необходимо получить (если undefined - необходимы корневые узлы) |

### Возвращаемое значение

`ProviderResult`\<`TreeNode`[]\> узла / корневые узлы

---

### `updateTreeNodes()`

```ts
updateTreeNodes(comments): void;
```

Объявлено в: [entities/CommentTreeView.ts:130](https://github.com/TimofeyYurkin/todo-manager-extension/blob/1daf422af5f5d09a905aa42519c2b9cdd8aeddf0/src/entities/CommentTreeView.ts#L130)

Перезаписывает структуру узлов, используя данные о комментариях из переданного массива

### Параметры

| Параметр | Тип | Описание |
| ------ | ------ | ------ |
| `comments` | [`Comment`](../interfaces.md#comment)[] | массив комментариев, который должен использоваться при перезаписи |

---

### `deleteCommentNode()`

```ts
deleteCommentNode(node): void;
```

Объявлено в: [entities/CommentTreeView.ts:188](https://github.com/TimofeyYurkin/todo-manager-extension/blob/1daf422af5f5d09a905aa42519c2b9cdd8aeddf0/src/entities/CommentTreeView.ts#L188)

Удаляет узел комментария из дерева узлов. 
Если этот узел был последним дочерним элементом узла файла, также удалит узел файла.
Если узел файла был последним дочерним элементом узла группы, также удалит корневой узел группы.

### Параметры

| Параметр | Тип | Описание |
| ------ | ------ | ------ |
| `node` | [`CommentNode`](#commentnode) | узел, который необходимо удалить |

---

### `refresh()`

```ts
refresh(): void;
```

Объявлено в: [entities/CommentTreeView.ts:223](https://github.com/TimofeyYurkin/todo-manager-extension/blob/1daf422af5f5d09a905aa42519c2b9cdd8aeddf0/src/entities/CommentTreeView.ts#L223)

Тригеррит событие для обновления UI-представления деревьев

---

### `CommentTreeItem`

Объявлено в: [entities/CommentTreeView.ts:230](https://github.com/TimofeyYurkin/todo-manager-extension/blob/1daf422af5f5d09a905aa42519c2b9cdd8aeddf0/src/entities/CommentTreeView.ts#L230)

Класс, описывающий UI-представление конкретного узла `CommentTreeView`

### Методы

---

### `constructor`

```ts
new CommentTreeItem(node, setIcon): CommentTreeItem;
```

Объявлено в: [entities/CommentTreeView.ts:237](https://github.com/TimofeyYurkin/todo-manager-extension/blob/1daf422af5f5d09a905aa42519c2b9cdd8aeddf0/src/entities/CommentTreeView.ts#L237)

Создает сущность `CommentTreeItem`

### Параметры

| Параметр | Тип | Описание |
| ------ | ------ | ------ |
| `node` | `TreeNode` | узел, который описывает объект |
| `setIcon` | `boolean` | флаг, отвечающий за добавление иконки к UI-представлению узла |

### Возвращаемое значение

[`CommentTreeItem`](#commenttreeitem)

---

## Интерфейсы

### `GroupNode`

Объявлено в: [entities/CommentTreeView.ts:10](https://github.com/TimofeyYurkin/todo-manager-extension/blob/1daf422af5f5d09a905aa42519c2b9cdd8aeddf0/src/entities/CommentTreeView.ts#L10)

Представляет узел-группу в древовидной структуре `Tree View`.
Описывает одну из категорий комментариев, которые обрабатывает плагин

| Свойство | Тип | Объявлено в |
| ------ | ------ | ------ |
| <a id="property-kind"></a> `kind` | `"group"` | [entities/CommentTreeView.ts:12](https://github.com/TimofeyYurkin/todo-manager-extension/blob/1daf422af5f5d09a905aa42519c2b9cdd8aeddf0/src/entities/CommentTreeView.ts#L12) |
| <a id="property-label"></a> `label` | `string` | [entities/CommentTreeView.ts:14](https://github.com/TimofeyYurkin/todo-manager-extension/blob/1daf422af5f5d09a905aa42519c2b9cdd8aeddf0/src/entities/CommentTreeView.ts#L14) |
| <a id="property-children"></a> `children` | [`FileNode`](#filenode)[] | [entities/CommentTreeView.ts:16](https://github.com/TimofeyYurkin/todo-manager-extension/blob/1daf422af5f5d09a905aa42519c2b9cdd8aeddf0/src/entities/CommentTreeView.ts#L16) |

***

### `FileNode`

Объявлено в: [entities/CommentTreeView.ts:23](https://github.com/TimofeyYurkin/todo-manager-extension/blob/1daf422af5f5d09a905aa42519c2b9cdd8aeddf0/src/entities/CommentTreeView.ts#L23)

Представляет узел-файл в древовидной структуре `Tree View`.
Описывает файл со связанными с ним комментариями определенной категории

| Свойство | Тип | Объявлено в |
| ------ | ------ | ------ |
| <a id="property-kind-1"></a> `kind` | `"file"` | [entities/CommentTreeView.ts:25](https://github.com/TimofeyYurkin/todo-manager-extension/blob/1daf422af5f5d09a905aa42519c2b9cdd8aeddf0/src/entities/CommentTreeView.ts#L25) |
| <a id="property-label-1"></a> `label` | `string` | [entities/CommentTreeView.ts:27](https://github.com/TimofeyYurkin/todo-manager-extension/blob/1daf422af5f5d09a905aa42519c2b9cdd8aeddf0/src/entities/CommentTreeView.ts#L27) |
| <a id="property-children-1"></a> `children` | [`CommentNode`](#commentnode)[] | [entities/CommentTreeView.ts:29](https://github.com/TimofeyYurkin/todo-manager-extension/blob/1daf422af5f5d09a905aa42519c2b9cdd8aeddf0/src/entities/CommentTreeView.ts#L29) |

***

### `CommentNode`

Объявлено в: [entities/CommentTreeView.ts:36](https://github.com/TimofeyYurkin/todo-manager-extension/blob/1daf422af5f5d09a905aa42519c2b9cdd8aeddf0/src/entities/CommentTreeView.ts#L36)

Представляет узел-комментарий в древовидной структуре `Tree View`.
Расширяет базовый интерфейс [Comment](../interfaces.md#comment) дополнительными свойствами

| Свойство | Тип | Унаследовано от | Объявлено в |
| ------ | ------ | ------ | ------ |
| <a id="property-kind-2"></a> `kind` | `"comment"` | - | [entities/CommentTreeView.ts:38](https://github.com/TimofeyYurkin/todo-manager-extension/blob/1daf422af5f5d09a905aa42519c2b9cdd8aeddf0/src/entities/CommentTreeView.ts#L38) |
| <a id="property-label-2"></a> `label` | `string` | - | [entities/CommentTreeView.ts:40](https://github.com/TimofeyYurkin/todo-manager-extension/blob/1daf422af5f5d09a905aa42519c2b9cdd8aeddf0/src/entities/CommentTreeView.ts#L40) |
| <a id="property-type"></a> `type` | [`CommentType`](../interfaces.md#commenttype) | [`Comment`](../interfaces.md#comment).[`type`](../interfaces.md#property-type-1) | [interfaces.ts:12](https://github.com/TimofeyYurkin/todo-manager-extension/blob/1daf422af5f5d09a905aa42519c2b9cdd8aeddf0/src/interfaces.ts#L12) |
| <a id="property-priority"></a> `priority` | [`PriorityLevel`](../interfaces.md#prioritylevel) | [`Comment`](../interfaces.md#comment).[`priority`](../interfaces.md#property-priority-1) | [interfaces.ts:14](https://github.com/TimofeyYurkin/todo-manager-extension/blob/1daf422af5f5d09a905aa42519c2b9cdd8aeddf0/src/interfaces.ts#L14) |
| <a id="property-text"></a> `text` | `string` | [`Comment`](../interfaces.md#comment).[`text`](../interfaces.md#property-text-1) | [interfaces.ts:16](https://github.com/TimofeyYurkin/todo-manager-extension/blob/1daf422af5f5d09a905aa42519c2b9cdd8aeddf0/src/interfaces.ts#L16) |
| <a id="property-path"></a> `path` | `string` | [`Comment`](../interfaces.md#comment).[`path`](../interfaces.md#property-path) | [interfaces.ts:25](https://github.com/TimofeyYurkin/todo-manager-extension/blob/1daf422af5f5d09a905aa42519c2b9cdd8aeddf0/src/interfaces.ts#L25) |
| <a id="property-filename"></a> `filename` | `string` | [`Comment`](../interfaces.md#comment).[`filename`](../interfaces.md#property-filename) | [interfaces.ts:27](https://github.com/TimofeyYurkin/todo-manager-extension/blob/1daf422af5f5d09a905aa42519c2b9cdd8aeddf0/src/interfaces.ts#L27) |
| <a id="property-line"></a> `line` | `number` | [`Comment`](../interfaces.md#comment).[`line`](../interfaces.md#property-line) | [interfaces.ts:29](https://github.com/TimofeyYurkin/todo-manager-extension/blob/1daf422af5f5d09a905aa42519c2b9cdd8aeddf0/src/interfaces.ts#L29) |
