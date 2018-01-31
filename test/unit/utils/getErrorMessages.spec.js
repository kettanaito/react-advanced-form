import { fromJS, Map } from 'immutable';
import { expect } from 'chai';
import { BothValidationType } from '../../../src/classes/ValidationType';
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
    required: true
  });

  const fields = fromJS({
    anotherField: fieldProps
  });

  /**
   * Test scenarios.
   */
  it('Name-specific "missing" message is taken when present', async () => {
    const validationResult = await fieldUtils.validate({
      type: BothValidationType,
      fieldProps: fieldProps.set('value', null),
      fields,
      formRules
    });

    const resolvedMessages = fieldUtils.getErrorMessages({
      validationResult,
      fieldProps,
      messages,
      fields
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
        formRules
      }),
      fieldProps,
      messages,
      fields
    });

    expect(resolvedMessages).to.be.an.instanceOf(Array).with.lengthOf(1);
    expect(resolvedMessages).to.deep.equal([messages.getIn(['name', fieldProps.get('name'), 'invalid'])]);
  });

  it('Type-specific "missing" message is used as a fallback', async () => {
    const validationResult = await fieldUtils.validate({
      type: BothValidationType,
      fieldProps: fieldProps.set('value', null),
      fields,
      formRules
    });

    const resolvedMessages = fieldUtils.getErrorMessages({
      validationResult,
      fieldProps,
      messages: messages.deleteIn(['name', fieldProps.get('name'), 'missing']),
      fields
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
        formRules
      }),
      fieldProps,
      messages: messages.deleteIn(['name', fieldProps.get('name'), 'invalid']),
      fields
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
        formRules
      }),
      fieldProps,
      messages: messages
        .deleteIn(['name', fieldProps.get('name'), 'missing'])
        .deleteIn(['type', fieldProps.get('type'), 'missing']),
      fields
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
        formRules
      }),
      fieldProps,
      messages: messages
        .deleteIn(['name', fieldProps.get('name'), 'invalid'])
        .deleteIn(['type', fieldProps.get('type'), 'invalid']),
      fields
    });

    expect(resolvedMessages).to.be.an.instanceOf(Array).with.lengthOf(1);
    expect(resolvedMessages).to.deep.equal([messages.getIn(['general', 'invalid'])]);
  });
});
