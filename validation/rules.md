# Rules

* [Introduction](rules.md#introduction)
* [Validation schema](rules.md#validation-schema)
* [Rule definition](rules.md#rule-definition)
* [Resolvers](rules.md#resolvers)
* [Priority & exclusion](rules.md#priority-exclusion)
* [Named rules](rules.md#named-rules)
* [Multiple rules](rules.md#multiple-rules)
* [Referencing fields](rules.md#referencing-fields)
* [Extending schema](rules.md#extending-schema)
* [Example](rules.md#example)

## Introduction

The validation logic is completely decoupled from the view \(React\) part of a form due to proper responsibilities separation. React Advanced Form uses a validation schema to handle field validation. Once the schema is applied to `FormProvider` or `Form` via `rules` prop, children fields begin to abide by the defined validation rules automatically.

## Validation schema

Validation schema is a plain JavaScript object of the pre-defined structure, which is responsible for selecting field\(s\) and applying validation rules to them.

```typescript
type ValidationSchema = {
  extend?: boolean,
  type?: {
    [fieldType: string]: RuleDefinition
  },
  name?: {
    [fieldName: string]: RuleDefinition
  }
}
```

## Rule definition

To define a new rule a field must be selected first. The latter can be done based on `name` or `type` of the field, both options using the same syntax. Once the field\(s\) is selected, it expects a [resolver function](rules.md#resolvers) as the value.

For example, let's create a rule for the fields with type `text`, saying that the entered value must not equal to `foo`:

```javascript
export default {
  type: {
    text: ({ value }) => (value !== 'foo')
  }
};
```

The very same syntax is used for `name` specific rules.

## Resolvers

Resolver is a function responsible for resolving the next validity state of a field.

### Syntax

```typescript
type TRuleResolver = ({ value, fieldProps, fields, form }) => boolean;
```

### Parameters

* `value` - a shorthand reference to the field's value at the moment of resolver execution.
* `fieldProps` - a reference to the field's props.
* `fields` - a map of the sibling fields.
* `form` - a reference to the `<Form>` component.

### Return value

A boolean stating whether the current state of the field is valid.

## Priority & exclusion

### Priority

Execution order of the validation rules can be described by the following ordered list:

1. [`Field.props.rule`](../components/field/props/rule.md) - when present, synchronous validation rule provided explicitly to a certain field has the highest priority during the execution.
2. `schema.name[fieldName]` - name-specific rules have the highest priority in the validation schema, and are executed _before_ type-specific rules.
3. `schema.type[fieldType]` - type-specific rules are executed once all the name-specific rules are resolved.

Understanding the order, as well as the [rules exclusion](rules.md#exclusion), helps to design the most flexible validation rules.

### Exclusion

Validation rules are exclusive, which implies that whenever the preceding rule of the higher priority rejects, the next rules are not executed at all. Consider the next validation schema:

```javascript
export default {
  type: {
    number: ({ value }) => (value > 5)
  },
  name: {
    someField: ({ value }) => /[0-9]/.test(value)
  }
};
```

And the next field component:

```jsx
<Input name="someField" type="number" />
```

Whenever the value of the field contains anything but numbers, the `schema.name.someField` rule will reject, and `schema.type.number` rule will not even be executed.

## Named rules

Each field selector can accept the map of the `<ruleName, resolver>` shape to list multiple rules relative to the same selector.

```jsx
export default {
  type: {
    password: {
      capitalLetter: ({ value }) => /[A-Z]/.test(value),
      oneNumber: ({ value }) => /[0-9]/.test(value)
    }
  }
};
```

Apart from applying multiple rules to the same field, named rules allow to associate specific messages with each rule based on the rule name. Considering the example above, we can have separate messages for `capitalLetter` and `oneNumber` rules independently. Learn more on how to do that in [Validation messages: Named resolvers](messages.md#named-resolvers) section.

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

> **Note:** Each of the multiple validation rules _must_ be a [named rule](rules.md#named-rules).

Multiple type-specific rules are declared in the same way.

With the multiple rules the execution order differs. Named rules of the same selector \(name/type\) are executed in parallel, regardless of the resolving status of their siblings. Considering the example above, `oneNumber` rule will be executed even if `capitalLetter` rejects.

## Referencing fields

There is a `field` argument property exposed in each resolver function. It allows to reference another fields of the same form, and base the validation logic on their state.

Whenever a field is referenced in a resolver, the latter is automatically called each time the referenced field's prop update. Consider the following example:

```javascript
{
  name: {
    confirmPassword: ({ value, fields }) => {
      return (value === fields.password.value);
    }
  }
}
```

Based on the declaration above, a `[name="confirmPassword"]` field is valid when its `value` equals to the `value` prop of the `[name="password"]` sibling field. By referencing another field, `confirmPassword` field is re-validated _each time_ when the `value` prop of `password` field updates.

## Extending schema

It is possible to extend or override a validation schema using the `extend` option on the root level of the schema. When set to `true`, the current schema will extend \(deep merge\) any schema of the higher scope \(i.e. the one provided by `FormProvider`\). When set to `false`, the current schema will completely override any higher scope schema.

```javascript
const customRules = {
  extend: true, // extend any rules from the higher scope
  name: {
      myField: ({ value }) => (value !== 'foo')
  }
};
```

## Example

