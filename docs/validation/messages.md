# Validation messages

* [Selectors](#selectors)
* [Resolvers](#resolvers)
  * [Generic states](#generic-states)
  * [Named resolvers](#named-resolvers)
* [Fallbacks](#fallbacks)
  * [Fallback sequence](#fallback-sequence)
  * [Fallback example](#fallback-example)

## Selectors
Selectors are used to map the [message resolvers](#resolvers) to the relevant field(s).

| Selector | Description |
| ---- | ----------- |
| `name` | Name-specific messages. |
| `type` | Type-specific messages. |
| `general` | General messages. Those are used as fallback values in case more specific messages are not present. |

Each selector expects the map of the selector values and its [resolvers](#resolvers):

```ts
type ValidationMessages = {
  [selector: string]: {
    [selectorValue: string]: MessageResolver
  }
}
```

## Resolvers
Resolver is an Object which maps the rule name to its actual message, or another resolver.

```ts
type MessageResolver = {
  [genericState: string]: Message,
  rule?: {
    [ruleName: string]: Message
  }
}

type Message = string | ({ fieldProps, fields, form, ...extra }) => string;
```

### Generic states
There are multiple generic states provided within each resolver by default.

| Generic state | Description |
| ------------- | ----------- |
| `missing` | Resolves for the empty required field. |
| `invalid` | Resolvers for the field with unexpected value when there are no higher specificity resolvers present. |
| `async` | Resolves for the [asynchronous validation](../components/Field/props/asyncRule.md) of the field. |

### Named resolvers
It is possible to define named resolvers corresponding to the [named validation rules](./rules.md#named-rules). These resolvers are defined under the `rule` key of the main resolver.

```js
export default {
  type: {
    password: {
      missing: 'Please provide the password',
      invalid: 'The passwords is invalid',
      rule: {
        minLength: 'Password must be at least 6 characters long'
      }
    }
  }
}
```

> **Note:** Named resolver *must* have the corresponding validation rule with the same name in order to resolve. Otherwise, the closest validation message will be returned by the resolver. Considering the example above, if `minLength` rule doesn't exist and the `type=["password"]` field is invalid, the closest `invalid` resolver will be used (which is `type.password.invalid` in this case).

## Fallbacks
Whenever the resolver cannot resolve it would attempt to grab the closest resolver recursively and resolve it instead. Fallback resolvers are iterated by their specificity, which can be presented as follows:

### Fallback sequence
1. Named resolver for the same level selector.
1. General resolver for the same level selector.
1. General resolver for the next level selector.
1. General resolver for the general selector.

### Fallback example
Consider the following validation messages:

```js
export default {
  general: {
    invalid: 'General invalid message'
  },
  type: {
    email: {
      invalid: 'E-mail is invalid'
    }
  },
  name: {
    userEmail: {
      invalid: 'User e-mail is invalid',
      rule: {
        includesAt: 'E-mail must include "@" character'
      }
    }
  }
};
```

And the following component layout:

```jsx
<Form>
  <Input
    type="email"
    name="userEmail"
    value="foo" />
</Form>
```

With the given scenario the `includesAt` validation rule would reject, marking the field as unexpected. This must be reflected in the UI using the validation messages schema.

This is the priority sequence in which resolvers will attempt to resolve the validation message:

1. `name.userEmail.rule.includesAt`
1. `name.userEmail.invalid`
1. `type.email.invalid`
1. `general.invalid`

The validation message resolves as soon as the resolver returns the value. The same sequence applies for the type-specific named resolvers.
