# Presets

> This topic is related to [`createField`](./basics.md) high-order component. Make sure to understand the context it is being described.

Certain field types always have the same behavior, therefore providing the same options each time is a huge repetition. To reduce the latter we have introduced the sets of pre-defined options, called *presets*, which suits the respective field types.

Presets cannot and must not cover the behavior of the custom fields, as predicting the latter is never a responsibility of React Advanced Form. Presets are here for seamless integration (i.e. styling) of the common field types.

## Presets list
* `fieldPresets.checkbox`
* `fieldPresets.select`
* `fieldPresets.radio`

> You do not need any presets/options for the field types not listed in the presets list. For example, you do not need any presets for `[type="text"]` or `[type="textarea"]` field types.

## Presets usage
Include the presets:

```js
import { fieldPresets } from 'react-advanced-form';
```

Provide the needed preset instead of the `options` parameter:
```js
export default createField(fieldPresets.select)(CustomField);
```

## Custom presets
It is recommended to create custom presets which cover the behavior of your custom fields. Just follow the options API and reuse field logic throughout your code base without repetition.
