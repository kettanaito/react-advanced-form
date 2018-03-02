# Presets

> This topic is related to [`createField`](./basics.md) high-order component. Make sure to understand the context it is being described.

Certain field types always have the same behavior, therefore providing the same options each time is a huge repetition. To reduce the latter we have introduced the sets of pre-defined options, called *presets*, which suits the respective field types.

Presets cannot and must not cover the behavior of the custom fields, as predicting the latter is never a responsibility of React Advanced Form. Presets are here for seamless integration (i.e. styling) of the common field types.

## Presets list
* `fieldPresets.input`
* `fieldPresets.textarea`
* `fieldPresets.checkbox`
* `fieldPresets.select`
* `fieldPresets.radio`

## Presets usage
Include the presets:

```js
import { fieldPresets } from 'react-advanced-form';
```

Provide the needed preset instead as the argument to `createField`:

```js
export default createField(fieldPresets.select)(CustomField);
```
