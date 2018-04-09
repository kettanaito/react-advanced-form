# Summary

## General

* [Introduction](./README.md)
* [Concept](./docs/general/concept.md)
* [FAQ](./docs/general/faq.md)

## Getting started

* [Installation](./docs/getting-started/installation.md)
* [Creating fields](./docs/getting-started/creating-fields.md)
* [Creating form](./docs/getting-started/creating-form.md)
* [Validation rules](./docs/getting-started/validation-rules.md)
* [Validation messages](./docs/getting-started/validation-messages.md)
* [Applying validation](./docs/getting-started/applying-validation.md)
* [Handle submit](./docs/getting-started/handle-submit.md)

## Architecture

* [Argument properties](./docs/architecture/argument-properties.md)
* [Referencing](./docs/architecture/referencing.md)
* [Field lifecycle](./docs/architecture/field-lifecycle.md)
* [Reactive props](./docs/architecture/reactive-props.md)

## High-order components

* [createField](./docs/hoc/createField.md)
  * [Options](./docs/hoc/createField/options.md)
  * [Presets](./docs/hoc/createField/presets.md)
  * [Exposed props](./docs/hoc/createField/props.md)

## Components

* [FormProvider](./docs/components/Provider.md)
* [Form](./docs/components/Form.md)
  * Props
    * [innerRef](./docs/components/Form/props/innerRef.md)
    * [action](./docs/components/Form/props/action.md)
    * [rules](./docs/components/Form/props/rules.md)
    * [messages](./docs/components/Form/props/messages.md)
  * Methods
    * [validate\(\)](./docs/components/Form/methods/validate.md)
    * [serialize\(\)](./docs/components/Form/methods/serialize.md)
    * [submit\(\)](./docs/components/Form/methods/submit.md)
    * [reset\(\)](./docs/components/Form/methods/reset.md)
  * Callbacks
    * [onFirstChange](./docs/components/Form/callbacks/onFirstChange.md)
    * [onReset](./docs/components/Form/callbacks/onReset.md)
    * [onInvalid](./docs/components/Form/callbacks/onInvalid.md)
    * [onSubmitStart](./docs/components/Form/callbacks/onSubmitStart.md)
    * [onSubmitted](./docs/components/Form/callbacks/onSubmitted.md)
    * [onSubmitFailed](./docs/components/Form/callbacks/onSubmitFailed.md)
    * [onSubmitEnd](./docs/components/Form/callbacks/onSubmitEnd.md)

* [Field.Group](./docs/components/Field.Group.md)

* Field
  * Props
    * Generic props
    * [rule](./docs/components/Field/props/rule.md)
    * [asyncRule](./docs/components/Field/props/asyncRule.md)
    * [skip](./docs/components/Field/props/skip.md)
  * Callbacks
    * [onFocus](./docs/components/Field/callbacks/onFocus.md)
    * [onChange](./docs/components/Field/callbacks/onChange.md)
    * [onBlur](./docs/components/Field/callbacks/onBlur.md)

## Validation

* [Getting started](./docs/validation/getting-started.md)
* [Logic](./docs/validation/logic.md)
* [Rules](./docs/validation/rules.md)
* [Messages](./docs/validation/messages.md)

## Developers

* [Contributing](./docs/CONTRIBUTING.md)
* [Testing](./docs/TESTING.md)
