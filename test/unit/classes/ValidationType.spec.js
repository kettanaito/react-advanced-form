import { expect } from 'chai';
import { fromJS, Map } from 'immutable';
import { BothValidationType } from '../../../src/classes/ValidationType';

describe('ValidationType', function () {
  it('shouldValidate', () => {
    const dynamicRequiredField = Map({ validaredSync: false, required: () => false });
    const validatedField = Map({ validatedSync: true });
    const requiredField = Map({ validatedSync: false, required: true });
    const optionalField = Map({ validatedSync: false, required: false });
    const optionalFieldWithNameRule = Map({ name: 'field', required: false, value: 'foo '});
    const optionalFieldWithTypeRule = Map({ type: 'text', name: 'field', required: false, value: 'foo '});

    expect(BothValidationType.shouldValidate({
      fieldProps: dynamicRequiredField,
      formRules: Map()
    })).to.be.true;

    expect(BothValidationType.shouldValidate({
      fieldProps: validatedField,
      formRules: Map()
    })).to.be.false;

    expect(BothValidationType.shouldValidate({
      fieldProps: requiredField,
      formRules: Map()
    })).to.be.true;

    expect(BothValidationType.shouldValidate({
      fieldProps: optionalField,
      formRules: Map()
    })).to.be.false;

    expect(BothValidationType.shouldValidate({
      fieldProps: optionalFieldWithNameRule,
      formRules: fromJS({
        name: {
          field: ({ value }) => (value !== 'foo')
        }
      })
    })).to.be.true;

    expect(BothValidationType.shouldValidate({
      fieldProps: optionalFieldWithTypeRule,
      formRules: fromJS({
        type: {
          text: ({ value }) => (value !== 'foo')
        }
      })
    })).to.be.true;
  });
});
