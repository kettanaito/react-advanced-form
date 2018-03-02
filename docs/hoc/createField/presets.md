# Presets

> This topic is related to [`createField`](./basics.md) high-order component. Make sure to understand the context it is being described.

Presets contain pre-defined `createField` [options](./options.md) relevant to the respective field type. Those options ensure proper field behavior as well as automatically map essential form element's props (i.e. `placeholder`, `multiselect`, etc.) from the wrapped component to the actual form element.

Presets are designed for seamless integration of common field types. For the completely custom fields you may want to consider writing your own presets or extending the existing ones.

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
export default createField(fieldPresets.select)(Select);
```
