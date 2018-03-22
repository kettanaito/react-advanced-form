# Summary

## General

* [Introduction](./README.md)
* [Concept](./general/concept.md)
* [FAQ](./general/faq.md)

## Getting started

* [Installation](./getting-started/installation.md)
* [Creating fields](./getting-started/creating-fields.md)
* [Creating form](./getting-started/creating-form.md)
* [Validation rules](./getting-started/validation-rules.md)
* [Validation messages](./getting-started/validation-messages.md)
* [Applying validation](./getting-started/applying-validation.md)
* [Handle submit](./getting-started/handle-submit.md)

## Architecture

* [Argument properties](./architecture/argument-properties.md)
* [Referencing](./architecture/referencing.md)
* [Field lifecycle](./architecture/field-lifecycle.md)
* [Reactive props](./architecture/reactive-props.md)

## High-order components

* createField
  * [Basics](./hoc/createField/basics.md)
  * [Options](./hoc/createField/options.md)
  * [Presets](./hoc/createField/presets.md)
  * [Exposed props](./hoc/createField/props.md)

## Components

* [FormProvider](./components/Provider.md)
* [Form](./components/Form.md)
  * Props
    * [innerRef](./components/Form/props/innerRef.md)
    * [action](./components/Form/props/action.md)
    * [rules](./components/Form/props/rules.md)
    * [messages](./components/Form/props/messages.md)
  * Methods
    * [validate\(\)](./components/Form/methods/validate.md)
    * [serialize\(\)](./components/Form/methods/serialize.md)
    * [submit\(\)](./components/Form/methods/submit.md)
    * [reset\(\)](./components/Form/methods/reset.md)
  * Callbacks
    * [onFirstChange](./components/Form/callbacks/onFirstChange.md)
    * [onReset](./components/Form/callbacks/onReset.md)
    * [onInvalid](./components/Form/callbacks/onInvalid.md)
    * [onSubmitStart](./components/Form/callbacks/onSubmitStart.md)
    * [onSubmitted](./components/Form/callbacks/onSubmitted.md)
    * [onSubmitFailed](./components/Form/callbacks/onSubmitFailed.md)
    * [onSubmitEnd](./components/Form/callbacks/onSubmitEnd.md)

* [Field.Group](./components/Field.Group.md)

* Field
  * Props
    * Generic props
    * [rule](./components/Field/props/rule.md)
    * [asyncRule](./components/Field/props/asyncRule.md)
    * [skip](./components/Field/props/skip.md)
  * Callbacks
    * [onFocus](./components/Field/callbacks/onFocus.md)
    * [onChange](./components/Field/callbacks/onChange.md)
    * [onBlur](./components/Field/callbacks/onBlur.md)

## Validation

* [Getting started](./validation/getting-started.md)
* [Logic](./validation/logic.md)
* [Rules](./validation/rules.md)
* [Messages](./validation/messages.md)

## Developers

* [Contributing](./CONTRIBUTING.md)
* [Testing](./TESTING.md)
