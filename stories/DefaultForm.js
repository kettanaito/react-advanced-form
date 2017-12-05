import React, { Component } from 'react';
import { FormProvider, Form, Condition, Field } from '../src';
import MyInput from './templates/MyInput';
import MySelect from './templates/MySelect';

/* Form validation rules */
const formRules = {
  name: {
    firstName: ({ value }) => /^\w+$/.test(value)
  }
};

const formMessages = {
  general: {
    missing: 'Please provide the required field',
    invalid: 'Please provide a proper value',
    async: {
      defaultResolver: ({ someProperty }) => {
        return someProperty;
      }
    }
  },
  name: {
    numbersOnly: {
      invalid: 'Only numbers are allowed!',
      async: {
        customResolver: ({ res }) => {
          if (res.statusCode === 'FAILURE') return 'Validation failed';
        }
      }
    },
    firstName: {
      invalid: 'A name must contain letters.'
    },
    username: {
      async: {
        customResolver: ({ res, payload, fieldProps, formProps }) => {
          return payload.statusCode;
        }
      }
    },
    zipCode: {
      missing: 'Please enter a valid zip code.'
    }
  }
};

/* Composite field example */
const FieldsComposition = () => (
  <div style={{ display: 'flex' }}>
    <MyInput name="address" value="Baker" />
    <MyInput name="street" value="12/c" />
  </div>
);

export default class DefaultForm extends Component {
  state = {
    value: 1,
    valueTwo: 2,
    valueThree: 3,
    disabled: false
  }

  controlValue = (event) => {
    event.preventDefault();
    this.setState(prevState => ({ valueTwo: prevState.valueTwo + 1 }));
  }

  handleFormAction = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => reject({ errorMessage: 'foo' }), 2000);
    });
  }

  handleFormInvalid = ({ fields, invalidFields, formProps}) => {
    console.groupCollapsed('onInvalid');
    console.log('fields', fields);
    console.log('invalidFields', invalidFields);
    console.log('formProps', formProps);
    console.groupEnd();
  }

  handleSubmitStart = ({ fields, serialized, formProps }) => {
    console.groupCollapsed('handleSubmitStart');
    console.log('fields', fields);
    console.log('serialized', serialized);
    console.log('formProps', formProps);
    console.groupEnd();
  }

  handleSubmitted = ({ fields, serialized, formProps, res }) => {
    console.groupCollapsed('handleSubmitted');
    console.log('fields', fields);
    console.log('serialized', serialized);
    console.log('formProps', formProps);
    console.log('res', res);
    console.groupEnd();
  }

  handleSubmitFail = ({ fields, serialized, formProps, res }) => {
    console.groupCollapsed('handleSubmitFail');
    console.log('fields', fields);
    console.log('serialized', serialized);
    console.log('formProps', formProps);
    console.log('res', res);
    console.groupEnd();
  }

  handleSubmitEnd = ({ fields, serialized, formProps, res }) => {
    console.groupCollapsed('handleSubmitEnd');
    console.log('fields', fields);
    console.log('serialized', serialized);
    console.log('formProps', formProps);
    console.log('res', res);
    console.groupEnd();
  }

  render() {
    const { value, valueTwo, valueThree, disabled } = this.state;

    return (
      <FormProvider
        rules={ formRules }
        messages={ formMessages }>
        <Form
          id="default-form-example"
          action={this.handleFormAction}
          onInvalid={this.handleFormInvalid}
          onSubmitStart={this.handleSubmitStart}
          onSubmitted={this.handleSubmitted}
          onSubmitFailed={this.handleSubmitFail}
          onSubmitEnd={this.handleSubmitEnd}>
          <div className="field-group">

            {/* Select */}
            <label>
              Select example:
              <Field.Select name="choice" initialValue="three">
                <option value="one">One</option>
                <option value="two">Two</option>
                <option value="three">Three</option>
              </Field.Select>
            </label>

            {/* <Field.Select name="selectField">
              <option value="first">First value</option>
              <option value="second">Second value</option>
            </Field.Select> */}

            {/* Input */}
            <div>
              <label>
                Choose one of the following:
              </label>
              <label>
                <Field.Radio
                  name="radioField"
                  value="Goose" />
                  Goose
              </label>

              <label>
                <Field.Radio
                  name="radioField"
                  value="Duck"
                  checked />
                  Duck
              </label>

              <label>
                <Field.Radio
                  name="radioField"
                  value="Kangaroo" />
                  Kangaroo
              </label>
            </div>

            <Field.Checkbox name="acceptTerms" />

            {/* Input */}
            {/* <Field.Group name="groupOne">
              <label>
                Filed with client rule (optional):
                <MyInput
                  name="fieldOne"
                  initialValue="1"
                  disabled={ disabled } />
              </label> */}

              {/* <label>
                Prefilled with initialValue
                <MyInput
                  name="initialValue"
                  rule={/^\d+$/}
                  initialValue="John Wick" />
              </label>
            </Field.Group> */}

            {/* <label>
              Prefilled with initialValue
              <MyInput
                name="fieldFoo"
                rule={/^\d+$/}
                initialValue=""
                required />
            </label> */}

            {/* <label>
              Async rule (optional)
              <MyInput
                name="asyncOptional"
                asyncRule={({ fieldProps }) => {
                  return fetch('http://demo9102997.mockable.io/validate/productId', {
                    method: 'POST',
                    body: JSON.stringify({
                      username: fieldProps.value
                    })
                  });
                }} />
            </label> */}

            {/* <label>
              Filed with client rule (optional):
              <MyInput
                name="fieldTwo"
                rule={/^\d+$/}
                value={ valueTwo }
                onChange={({ nextValue }) => this.setState({ valueTwo: nextValue })} />
            </label>

            <label>
              Filed with client rule (optional):
              <MyInput
                name="fieldThree"
                rule={/^\d+$/}
                value={ valueThree }
                onChange={({ nextValue }) => this.setState({ valueThree: nextValue })} />
            </label> */}

            {/* <label>
              Field (required):
              <MyInput
                name="password"
                required />
            </label> */}
{/*
            <label>
              Async rule (optional)
              <MyInput
                name="asyncOptional"
                asyncRule={({ fieldProps }) => {
                  return fetch('http://demo9102997.mockable.io/validate/productId', {
                    method: 'POST',
                    body: JSON.stringify({
                      username: fieldProps.value
                    })
                  });
                }} />
            </label>

            <label>
              Zip code:
              <MyInput
                name="zipCode"
                asyncRule={({ fieldProps }) => {
                  console.log('fieldProps', fieldProps);

                  return fetch('http://www.mocky.io/v2/5a1d8ee02e0000fc3848b8f2', {
                    method: 'POST',
                    body: JSON.stringify({
                      username: fieldProps.value
                    })
                  })
                  .then(res => res.json())
                  .then((response) => {
                    return {
                      valid: (response.statusCode === 'SUCCESS'),
                      someProperty: 'someValue'
                    };
                  }).catch(console.log);
                }}
                required />
            </label> */}

            {/* <label>
              Field with resolvable prop (required)
              <MyInput
                name="resolvableField"
                value="Another value"
                rule={({ value }) => value === 'John'}
                required={({ fields }) => fields.address && !!fields.address.value} />
            </label> */}

            {/* <label>
              Composite field:
              <FieldsComposition />
            </label>

            <label>
              Billing address
              <Field.Group name="billingAddress">
                <MyInput name="firstName" value="John" required />
                <MyInput name="lastName" value="Maverick" required />
              </Field.Group>
            </label>

            <label>
              Delivery address
              <Field.Group name="deliveryAddress">
                <MyInput name="firstName" value="Katheline" required />
                <MyInput name="lastName" value="Stark" required />
              </Field.Group>
            </label> */}
          </div>

          <button onClick={ this.controlValue }>Set value</button>

          <button type="submit">Submit</button>
        </Form>
      </FormProvider>
    );
  }
}
