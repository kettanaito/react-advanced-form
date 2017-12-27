# Custom fields

## Disclaimer
This is a highly experimental topic and it's highly subjected to unexpected behavior. Although unlikely, there is a chance React Advanced Form doesn't have certain functionality at the moment to allow the integration of certain third-party component. Please check the [Issues](https://github.com/kettanaito/react-advanced-form/issues) of the library if encountered any obstacles during the implementation of custom fields. Thank you.

## Introduction
React Advanced Form is built in a versatile way, which allows the implementation of the completely custom field elements. Those will be registered within the Form and will behave as any native field provided by React Advanced Form (such as `Field.Input` or `Field.Select`).

> **Note:** This document explains how to create custom fields, meaning the fields with custom *functionality*. This is **NOT** the way to style the fields. See [Custom styling](./custom-styling.md) documentation for that matter.

Implementation of the custom field implies the profound understanding of the core concept of the library, Form/Field relation and context props management logic. Take a look at the native fields to see how they are written.

## Getting started
A new custom field should be presented as a class which extends a generic `Field` class exposed by the library. Take a look at the simple example of a custom field below:

```jsx
import React from 'react';
import { Field } from 'react-advanced-form';

export default class CustomField extends Field {
    renderElement(props, contextProps) {
        return (<ElementToRender value={ contextProps.get('value') }>);
    }
}
```

By extending the `Field` class, this custom field will share the behavior of the native fields, meaning:
* It gets registered in the Form's state, thus available within `fields` Object by its name,
* Its record in the Form's state will react to the changes of the custom field (including custom events handling declared in the custom field's class methods),
* Unmounting the custom field will remove the respective record from the Form's state

## Field lifecycle
Below there is a complete list of the `Field` methods which can be provided within the custom field component to change the behavior of the latter. Think of these methods as of React's component lifecycle methods, but related to the `Field` lifecycle.

### `Field.fieldWillRegister(): Object`

Called right before the field is registered within the parent `Form`. Should return the props (`Object`) to be used as the record properties within the form's state. 

This is the proper place to declare a custom behavior, such as properties remapping, affecting how the custom field is stored in the form's state. By default, `this.props` is returned.

### `Field.renderElement(props: Object, contextProps: Map): React.ReactElement`
An **obligatory** method responsible for rendering the field's component. Should be always provided explicitly.
```jsx
export default class CustomField extends Field {
    renderElement(props, contextProps) {
        return (<select value={ contextProps.get('value') }>);
    }
}
```

There is no need to remap all the provided `props`, as some of them (i.e. `value`, `style`, `required`, `disabled` and others) are mapped into the rendered component by default. Privode the props explicitly when needed. The props provided in `renderElement` method always override the natively mapped props. 

### `Field.fieldWillUnregister(): null`
Called immediately before the field component is unmounted and its record is removed from the form's state.

## Event handlers
Apart from the lifecycle methods, there are several event handlers available in the `Field` generic class. See the implementation of the native fields exposed by React Advanced Form to learn more on how to use these methods properly.

### `Field.handleFocus()`
Handles the focus of the field. Should call the respective handler function provided by the parent `Form` component - `this.context.handleFieldFocus`.

### `Field.handleChange()`
Handles the change of the field. Should call the respective handler function provided by the parent `Form` component - `this.context.handleFieldChange`.

### `Field.handleBlur()`
Handles the blur event of the field. Should call the respective handler function provided by the parent `Form` component - `this.context.handleFieldBlur`.

> **Note:** These are the crucial methods to handle the updates related to the field's record in the form's state. When declared poorly, the field's behavior may become unexpected. Always ensure the respective handle functions are called within each of those methods.

## Usage
As an example, let's create a custom field component which will utilize an abstract third-party form element. This way we can benefit from both React Advanced Form and third-party functionality.

```jsx
import { Field } from 'react-advanced-form';
import CustomSelect from '...';

export default class MySelect extends Field {
    fieldWillRegister() {
        /* Assume the selected option is stored under "selectedOption" prop of the third-party component */
        const { selectedOption } = this.props;

        return {
            ...this.props,
            value: selectedOption
        };
    }

    renderElement(props, contextProps) {
        return (<CustomSelect />);
    }
}
```

Then, the custom field can be used just as any native field:
```jsx
import React from 'react';
import { Form } from 'react-advanced-form';
import MySelect from './MySelect';

const fruitsOptions = {
    apple: 'Apple',
    banana: 'Banana'
};

export default class MyForm extends React.Component {
    render() {
        return (
            <Form>
                <MySelect
                    name="fruits"
                    options={ fruitsOptions }
                    selectedOption={ fruitsOptions.banana } />
            </Form>
        );
    }
}
```
