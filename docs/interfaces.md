[TODO Manager](modules.md) / interfaces

## `/interfaces.ts`

### `CommentBase`

Объявлено в: [interfaces.ts:10](https://github.com/TimofeyYurkin/todo-manager-extension/blob/1daf422af5f5d09a905aa42519c2b9cdd8aeddf0/src/interfaces.ts#L10)

Описывает базовую информацию о комментарии

| Свойство | Тип | Объявлено в |
| ------ | ------ | ------ |
| <a id="property-type"></a> `type` | [`CommentType`](#commenttype) | [interfaces.ts:12](https://github.com/TimofeyYurkin/todo-manager-extension/blob/1daf422af5f5d09a905aa42519c2b9cdd8aeddf0/src/interfaces.ts#L12) |
| <a id="property-priority"></a> `priority` | [`PriorityLevel`](#prioritylevel) | [interfaces.ts:14](https://github.com/TimofeyYurkin/todo-manager-extension/blob/1daf422af5f5d09a905aa42519c2b9cdd8aeddf0/src/interfaces.ts#L14) |
| <a id="property-text"></a> `text` | `string` | [interfaces.ts:16](https://github.com/TimofeyYurkin/todo-manager-extension/blob/1daf422af5f5d09a905aa42519c2b9cdd8aeddf0/src/interfaces.ts#L16) |

***

### `Comment`

Объявлено в: [interfaces.ts:23](https://github.com/TimofeyYurkin/todo-manager-extension/blob/1daf422af5f5d09a905aa42519c2b9cdd8aeddf0/src/interfaces.ts#L23)

Описываю полную информацию о комментарии.
Расширяет интерфейс [CommentBase](#commentbase)

| Свойство | Тип | Унаследовано от | Объявлено в |
| ------ | ------ | ------ | ------ |
| <a id="property-type-1"></a> `type` | [`CommentType`](#commenttype) | [`CommentBase`](#commentbase).[`type`](#property-type) | [interfaces.ts:12](https://github.com/TimofeyYurkin/todo-manager-extension/blob/1daf422af5f5d09a905aa42519c2b9cdd8aeddf0/src/interfaces.ts#L12) |
| <a id="property-priority-1"></a> `priority` | [`PriorityLevel`](#prioritylevel) | [`CommentBase`](#commentbase).[`priority`](#property-priority) | [interfaces.ts:14](https://github.com/TimofeyYurkin/todo-manager-extension/blob/1daf422af5f5d09a905aa42519c2b9cdd8aeddf0/src/interfaces.ts#L14) |
| <a id="property-text-1"></a> `text` | `string` | [`CommentBase`](#commentbase).[`text`](#property-text) | [interfaces.ts:16](https://github.com/TimofeyYurkin/todo-manager-extension/blob/1daf422af5f5d09a905aa42519c2b9cdd8aeddf0/src/interfaces.ts#L16) |
| <a id="property-path"></a> `path` | `string` | - | [interfaces.ts:25](https://github.com/TimofeyYurkin/todo-manager-extension/blob/1daf422af5f5d09a905aa42519c2b9cdd8aeddf0/src/interfaces.ts#L25) |
| <a id="property-filename"></a> `filename` | `string` | - | [interfaces.ts:27](https://github.com/TimofeyYurkin/todo-manager-extension/blob/1daf422af5f5d09a905aa42519c2b9cdd8aeddf0/src/interfaces.ts#L27) |
| <a id="property-line"></a> `line` | `number` | - | [interfaces.ts:29](https://github.com/TimofeyYurkin/todo-manager-extension/blob/1daf422af5f5d09a905aa42519c2b9cdd8aeddf0/src/interfaces.ts#L29) |

## Алиасы типов

### `CommentType`

```ts
type CommentType = "TODO" | "FIX" | "BUG" | "NOTE";
```

Объявлено в: [interfaces.ts:2](https://github.com/TimofeyYurkin/todo-manager-extension/blob/1daf422af5f5d09a905aa42519c2b9cdd8aeddf0/src/interfaces.ts#L2)

Описывает существующие типы комментариев

***

### `PriorityLevel`

```ts
type PriorityLevel = 1 | 2 | 3;
```

Объявлено в: [interfaces.ts:7](https://github.com/TimofeyYurkin/todo-manager-extension/blob/1daf422af5f5d09a905aa42519c2b9cdd8aeddf0/src/interfaces.ts#L7)

Описывает существующие уровни приоритета (важности) комментариев.
1 - низший уровень приоритета, 3 - высший уровень приоритета
