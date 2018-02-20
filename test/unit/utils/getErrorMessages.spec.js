import { fromJS, Map } from 'immutable';
import { expect } from 'chai';
import { AsyncValidationType, BothValidationType } from '../../../src/classes/ValidationType';
import { form } from '../../utils';
import { fieldUtils } from '../../../src/utils';

describe('getErrorMessages', function () {
  /**
   * Preparations.
   */
  const formRules = fromJS({
    type: {
      email: ({ value }) => value.includes('@')
    },
    name: {
      userEmail: {
        firstRule: ({ value }) => /^\d+$/.test(value)
      }
    }
  });

  const messages = fromJS({
    general: {
      missing: 'General missing message',
      invalid: 'General invalid message'
    },
    type: {
      email: {
        missing: 'Email missing message',
        invalid: 'Email invalid message'
      }
    },
    name: {
      userEmail: {
        missing: 'Name missing message',
        invalid: 'Name invalid message'
      }
    }
  });

  const fieldProps = Map({
    name: 'userEmail',
    type: 'email',
    required: true,
    valuePropName: 'value'
  });

  const fields = fromJS({
    anotherField: fieldProps
  });

  it('Get "async" message for async validation error', async () => {
    const errorCode = 100;
    const asyncMessage = ({ errorCode }) => `Async message: ${errorCode}`;

    const validationResult = await fieldUtils.validate({
      type: AsyncValidationType,
      fieldProps: fieldProps
        .set('value', '5')
        .set('asyncRule', () => new Promise(resolve => resolve({
            valid: false,
            errorCode
          }))),
      formRules: formRules.delete('name'),
      fields,
      form
    });

    const resolvedMessages = fieldUtils.getErrorMessages({
      validationResult,
      fieldProps,
      messages: messages.setIn(['name', fieldProps.get('name'), 'async'], asyncMessage),
      fields,
      form
    });

    expect(resolvedMessages).to.be.an.instanceof(Array).with.lengthOf(1);
    expect(resolvedMessages).to.deep.equal([asyncMessage({ errorCode })]);
  });

  it('Async error message fallbacks to the closest sibling message', async () => {
    const validationResult = await fieldUtils.validate({
      type: AsyncValidationType,
      fieldProps: fieldProps
        .set('value', '5')
        .set('asyncRule', () => new Promise(resolve => resolve({
            valid: false
          }))),
      formRules: formRules.delete('name'),
      fields,
      form
    });

    const resolvedMessages = fieldUtils.getErrorMessages({
      validationResult,
      fieldProps,
      messages,
      form
    });

    expect(resolvedMessages).to.be.an.instanceof(Array).with.lengthOf(1);
    expect(resolvedMessages).to.deep.equal([messages.getIn(['name', fieldProps.get('name'), 'invalid'])]);
  });

  it('Display multiple named rule messages when present', async () => {
    const firstMessage = 'First rule message';
    const secondMessage = 'Second rule message';

    const resolvedMessages = fieldUtils.getErrorMessages({
      validationResult: await fieldUtils.validate({
        type: BothValidationType,
        fieldProps: fieldProps.set('value', 'foo'),
        fields,
        form,
        formRules: formRules.setIn(['name', fieldProps.get('name'), 'secondRule'], function ({ value }) {
          return (value !== 'foo');
        })
      }),
      fieldProps,
      messages: messages
        .setIn(['name', fieldProps.get('name'), 'rules', 'firstRule'], firstMessage)
        .setIn(['name', fieldProps.get('name'), 'rules', 'secondRule'], secondMessage),
      fields
    });

    expect(resolvedMessages).to.be.an.instanceof(Array).with.lengthOf(2);
    expect(resolvedMessages).to.deep.equal([firstMessage, secondMessage]);
  });

  it('Do not fallback for missing rule message when sibling rule message is present', async () => {
    const firstMessage = 'First rule message';

    const resolvedMessages = fieldUtils.getErrorMessages({
      validationResult: await fieldUtils.validate({
        type: BothValidationType,
        fieldProps: fieldProps.set('value', 'foo'),
        fields,
        form,
        formRules: formRules.setIn(['name', fieldProps.get('name'), 'secondRule'], function ({ value }) {
          return (value !== 'foo');
        })
      }),
      fieldProps,
      messages: messages.setIn(['name', fieldProps.get('name'), 'rules', 'firstRule'], firstMessage),
      fields
    });

    expect(resolvedMessages).to.be.an.instanceof(Array).with.lengthOf(1);
    expect(resolvedMessages).to.deep.equal([firstMessage]);
  });

  it('Name-specific named rule message is taken when present', async () => {
    const firstMessage = 'First rule message';

    const resolvedMessages = fieldUtils.getErrorMessages({
      validationResult: await fieldUtils.validate({
        type: BothValidationType,
        fieldProps: fieldProps.set('value', 'foo'),
        fields,
        form,
        formRules
      }),
      fieldProps,
      messages: messages.setIn(['name', fieldProps.get('name'), 'rules', 'firstRule'], firstMessage),
      fields
    });

    expect(resolvedMessages).to.be.an.instanceof(Array).with.lengthOf(1);
    expect(resolvedMessages).to.deep.equal([firstMessage]);
  });

  /**
   * Test scenarios.
   */
  it('Name-specific "missing" message is taken when present', async () => {
    const resolvedMessages = fieldUtils.getErrorMessages({
      validationResult: await fieldUtils.validate({
        type: BothValidationType,
        fieldProps: fieldProps.set('value', null),
        fields,
        form,
        formRules
      }),
      fieldProps,
      messages,
      fields,
      form
    });

    expect(resolvedMessages).to.be.an.instanceof(Array).with.lengthOf(1);
    expect(resolvedMessages).to.deep.equal([messages.getIn(['name', fieldProps.get('name'), 'missing'])]);
  });

  it('Name-specific "invalid" message is taken when present', async () => {
    const resolvedMessages = fieldUtils.getErrorMessages({
      validationResult: await fieldUtils.validate({
        type: BothValidationType,
        fieldProps: fieldProps.set('value', 'foo'),
        fields,
        form,
        formRules
      }),
      fieldProps,
      messages,
      fields,
      form
    });

    expect(resolvedMessages).to.be.an.instanceOf(Array).with.lengthOf(1);
    expect(resolvedMessages).to.deep.equal([messages.getIn(['name', fieldProps.get('name'), 'invalid'])]);
  });

  it('Type-specific "missing" message is used as a fallback', async () => {
    const validationResult = await fieldUtils.validate({
      type: BothValidationType,
      fieldProps: fieldProps.set('value', null),
      fields,
      form,
      formRules
    });

    const resolvedMessages = fieldUtils.getErrorMessages({
      validationResult,
      fieldProps,
      messages: messages.deleteIn(['name', fieldProps.get('name'), 'missing']),
      fields,
      form
    });

    expect(resolvedMessages).to.be.an.instanceOf(Array).with.lengthOf(1);
    expect(resolvedMessages).to.deep.equal([messages.getIn(['type', fieldProps.get('type'), 'missing'])]);
  });

  it('Type-specific "invalid" message is used as a fallback', async () => {
    const resolvedMessages = fieldUtils.getErrorMessages({
      validationResult: await fieldUtils.validate({
        type: BothValidationType,
        fieldProps: fieldProps.set('value', 'foo'),
        fields,
        form,
        formRules
      }),
      fieldProps,
      messages: messages.deleteIn(['name', fieldProps.get('name'), 'invalid']),
      fields,
      form
    });

    expect(resolvedMessages).to.be.an.instanceOf(Array).with.lengthOf(1);
    expect(resolvedMessages).to.deep.equal([messages.getIn(['type', fieldProps.get('type'), 'invalid'])]);
  });

  it('General "missing" message is used as a fallback', async () => {
    const resolvedMessages = fieldUtils.getErrorMessages({
      validationResult: await fieldUtils.validate({
        type: BothValidationType,
        fieldProps: fieldProps.set('value', null),
        fields,
        form,
        formRules
      }),
      fieldProps,
      messages: messages
        .deleteIn(['name', fieldProps.get('name'), 'missing'])
        .deleteIn(['type', fieldProps.get('type'), 'missing']),
      fields,
      form
    });

    expect(resolvedMessages).to.be.an.instanceOf(Array).with.lengthOf(1);
    expect(resolvedMessages).to.deep.equal([messages.getIn(['general', 'missing'])]);
  });

  it('General "invalid" message is used as a fallback', async () => {
    const resolvedMessages = fieldUtils.getErrorMessages({
      validationResult: await fieldUtils.validate({
        type: BothValidationType,
        fieldProps: fieldProps.set('value', 'foo'),
        fields,
        form,
        formRules
      }),
      fieldProps,
      messages: messages
        .deleteIn(['name', fieldProps.get('name'), 'invalid'])
        .deleteIn(['type', fieldProps.get('type'), 'invalid']),
      fields,
      form
    });

    expect(resolvedMessages).to.be.an.instanceOf(Array).with.lengthOf(1);
    expect(resolvedMessages).to.deep.equal([messages.getIn(['general', 'invalid'])]);
  });
});
