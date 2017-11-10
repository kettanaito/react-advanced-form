# Acceptance criteria

## Validation
### Rules declaration
**Type definition:**
```js
type TValidationRule = Function(value: mixed, props: Object, formProps: Object): boolean

type TValidationSchema = {
  type?: {
    [fieldType: string]: TValidationRule
  },
  name?: {
    [fieldName: string]: TValidationRule
  }
}
```

**Usage example:**
```js
// validation-rules.js
export default {
  /* Type validation */
  type: {
    password: value => value.test(/\d{3}/g) // field with type="password"
  },

  /* Name validation */
  name: {
    zipCode: value => value.test(/\d{5}/g) // field with name="zipCode"
  }
};
```

---

### Form validation
* Form should be able to accept validation rules declaration (a reference to the JS file)
* Form should be able to use custom validation rules, so that FormA may have rulesA, and FormB - rulesB

```jsx
import validationRules from './validation-rules';

<Form rules={validationRules}>...</Form>
```

---

### Field validation
Algorithm of field validation:

```js
// Form
validateField = (field) => {
  if (field.props.value) {
    /* Get name validation */
    const nameValidation = rules.getIn(['name', field.props.name]);
    if (nameValidation) {
      return nameValidation(field, field.props, this.props);
    }

    /* Get type validation */
    const typeValidation = rules.getIn(['type', field.props.type]);
    if (typeValidation) {
      return typeValidation(field, field.props, this.props);
    }
  } else {
    /* Validate required fields when empty */
    if (field.props.required) {
      // "Field should not be empty."
    }
  }
}
```

* The priority of field validation is as follows:
  1. Form validation rules (type -> name)
  1. Field validation rule (`this.props.rule`)
  1. Field `onBlur` async validation
* Should be possible to provide custom `rule: RegExp` prop
  * Once the prop is present, a field is matched against the provided RegExp on client-side

```jsx
<Input name="zip" rule={/\d{5}/} />
```

#### Async field validation
**Specification:**
* Async field validation is fired `onBlur` once `asyncRule` prop is present in the field's props
* Async validation expects a specific value (described below)
* Async validation is fired *only* once client-side validations (form validation, field validation) are resolved
* Once validation request is dispatched, field becomes `disabled` and a loding indicator is displayed at the right corner of the field
* Regardless of the payload, field becomes enabled after response is received

**Type definition:**
```js
type TAsyncRule = {
  /* URI of the validation web service */
  uri: String,

  /* Payload Object which should be sent */
  payload: Function(value: mixed, props: Object, formProps: Object): Object,

  /* Custom handler when field becomes valid */
  valid: Function(response: Object): boolean,

  /* Handler of response error */
  error: Function(response:Object): ?String
}
```
**Default values:**
```js
const defaultAsyncRule = {
  valid: response => (response.statusCode === '200'),
  error: response => response.errorMessage
}
```

**Usage example:**
```jsx
<Input asyncRule={{
  uri: 'http://domain.com/ws/validate-field',
  payload: (value, props, formProps) => value
}} />
```
