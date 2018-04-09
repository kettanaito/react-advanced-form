# Validation rules

* [Introduction](#introduction)
* [Definition](#definition)
* [Priority](#priority)
* [Named rules](#named-rules)
* [Multiple rules](#multiple-rules)
* [Extending rules](#extending-rules)
* [Example](#example)

## Introduction
As opposed to many solutions where a developer is being exposed a single `validate` callback and is forced to stuff all the validation logic inside, React Advanced Form uses a clean validation schema to provide validation to the fields.

Validation schema is a plain JavaScript object with the defined structure, which contains the validation rules. Each rule is applied to a field by the field's selector. There are `name` and `type` field selectors.

## Definition

```ts
type ValidationRules = {
  extend?: boolean,
  type: {
    [fieldType: string]: RuleDefinition
  },
  name: {
    [fieldName: string]: RuleDefinition
  }
}

type RuleResolver = ({
  value: mixed, // (shorthand) the value of the current field
  fieldProps: Object, // props of the current field
  fields: Object, // map of all fields present in the same Form
  form: ReactComponent // reference to the Form itself
}) => boolean

type RuleDefinition = RuleResolver | { [ruleName: string]: RuleResolver;
```

A rule resolver function must always return a `boolean`, stating that the current state of the field satisfies the rule.

## Priority
Validation rules are executed in a certain order and priority.

### Context priority
A synchronous rule declared under [`Field.props.rule`](../components/Field/props/rule.md) has the highest priority and is executed first, if present.

### Selector priority
There are two kinds of field selectors:

* `name` selectors allow to reference a field by its name. These have the highest priority in the validation schema and are executed first. Whenever a name-specific rule rejects, any type-specific rules for the same field *will not* be executed.
* `type` selectors reference a field by its type. These are complimentary to the name-specific rules, and are executed after them.

## Named rules
Each rule may have its own unique name:

```jsx
export default {
  type: {
    email: {
      isValid: ({ value }) => isEmail(value)
    }
  }
}
```

The main purpose of the named rule is to be able to associate a specific validation message with it, based on its name. Learn more about this in [Validation messages: Named resolvers](./messages.md#named-resolvers) section.

## Multiple rules
One field selector can have multiple rules:

```jsx
// src/validation-rules.js
export default {
  name: {
    userPassword: {
      capitalLetter: ({ value }) => /[A-Z]/.test(value),
      oneNumber: ({ value }) => /[0-9]/.test(value)
    }
  }
};
```

> **Note:** Each of the multiple validation rules *must* be a [named rule](#named-rules).

Multiple type-specific rules are declared in the same way.

With the multiple rules the execution order differs. Named rules of the same selector (name/type) are executed in parallel, regardless of the resolving status of their siblings. Considering the example above, `oneNumber` rule will be executed even if `capitalLetter` rejects.

## Referencing fields
There is a `field` argument property exposed in each resolver function. It allows to reference another fields of the same form, and base the validation logic on their state.

Whenever a field is referenced in a resolver, the latter is automatically called each time the referenced field's prop update. Consider the following example:

```js
{
  name: {
    confirmPassword: ({ value, fields }) => {
      return (value === fields.password.value);
    }
  }
}
```

Based on the declaration above, a `[name="confirmPassword"]` field is valid when its `value` equals to the `value` prop of the `[name="password"]` sibling field. By referencing another field, `confirmPassword` field is re-validated *each time* when the `value` prop of `password` field updates.

## Extending rules
While having application-wide rules is the recommended approach, each `Form` instance can have its own validation rules, which may, or may not extend the application-wide rules.

To extend the application-wide rules set the `extend` to `true`:

```js
const customRules = {
  extend: true, // extend any rules from the higher scope
  name: {
      myField: ({ value }) => (value !== 'foo')
  }
};
```

## Example

<iframe src="https://codesandbox.io/embed/53wlvmp42l?module=%2Fsrc%2Fvalidation-rules.js&moduleview=1" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
