/**
 * Type-specific validation.
 */
import { expect } from 'chai';
import { fromJS, Map } from 'immutable';
import { form as defaultForm } from '../../../../utils';
import { formUtils, fieldUtils } from '../../../../../src/utils';

describe('Type-specific validation', () => {
  const fields = fromJS({
    anotherField: Map({
      value: 'foo',
      required: true
    })
  });

  it('Functional rule', () => {
    const schema = fromJS({
      type: {
        text: ({ value }) => /^\d+$/.test(value)
      }
    });

    const fieldProps = Map({
      name: 'fieldName',
      type: 'text',
      valuePropName: 'value'
    });

    const form = {
      ...defaultForm,
      state: {
        rxRules: formUtils.getFieldRules({ fieldProps, schema })
      }
    };

    /* Unexpected field */
    const resultOne = fieldUtils.validateSync({
      fieldProps: fieldProps.set('value', 'letters'),
      fields,
      form
    }).toJS();

    expect(resultOne).to.include.keys(['rejectedRules', 'propsPatch']);
    expect(resultOne.propsPatch).to.have.property('expected', false);
    expect(resultOne).to.have.property('rejectedRules').with.length(1);
    expect(resultOne).to.have.property('rejectedRules').to.deep.equal([
      {
        selector: 'type',
        name: 'invalid',
        isCustom: false
      }
    ]);

    /* Expected field */
    const resultTwo = fieldUtils.validateSync({
      fieldProps: fieldProps.set('value', 'example@domain.com'),
      fields,
      form: {
        ...defaultForm,
        rxRules: formUtils.getFieldRules({
          fieldProps,
          schema: schema.setIn(['type', 'text'], ({ value }) => value.includes('@'))
        })
      }
    }).toJS();

    expect(resultTwo.propsPatch).to.have.property('expected', true);
    expect(resultTwo).to.have.property('rejectedRules').with.length(0);
  });

  it('Multiple named rules', () => {
    const schema = fromJS({
      type: {
        password: {
          capitalLetter: ({ value }) => /[A-Z]/.test(value),
          oneNumber: ({ value }) => /[0-9]/.test(value)
        }
      }
    });

    const fieldProps = Map({
      name: 'fieldName',
      type: 'password',
      valuePropName: 'value'
    });

    const form = {
      ...form,
      state: {
        rxRules: formUtils.getFieldRules({ fieldProps, schema })
      }
    };

    /**
     * Unexpected field (0/2).
     */
    const resultOne = fieldUtils.validateSync({
      fieldProps: fieldProps.set('value', 'foo'),
      fields,
      form
    }).toJS();

    expect(resultOne.propsPatch).to.have.property('expected', false);
    expect(resultOne).to.have.property('rejectedRules').with.length(2);
    expect(resultOne.rejectedRules).to.deep.equal([
      {
        name: 'capitalLetter',
        selector: 'type',
        isCustom: true
      },
      {
        name: 'oneNumber',
        selector: 'type',
        isCustom: true
      }
    ]);

    /**
     * Unexpected field (1/2).
     */
    const resultTwo = fieldUtils.validateSync({
      fieldProps: fieldProps.set('value', 'Capital'),
      fields,
      form
    }).toJS();

    expect(resultTwo.propsPatch).to.have.property('expected', false);
    expect(resultTwo).to.have.property('rejectedRules').with.length(1);
    expect(resultTwo.rejectedRules).to.deep.equal([
      {
        name: 'oneNumber',
        selector: 'type',
        isCustom: true
      }
    ]);

    /**
     * Expected field (2/2).
     */
    const resultThree = fieldUtils.validateSync({
      fieldProps: fieldProps.set('value', 'Capi5tal'),
      fields,
      form
    }).toJS();

    expect(resultThree.propsPatch).to.have.property('expected', true);
    expect(resultThree).to.have.property('rejectedRules').with.length(0);
  });

  it('Propagates custom "valuePropName" shorthand to resolver', () => {
    const schema = fromJS({
      type: {
        text: ({ customValueProp }) => {
          expect(customValueProp).not.to.be.null;
          expect(customValueProp).not.to.be.undefined;
          return (customValueProp !== 'foo')
        }
      }
    });

    const fieldProps = Map({
      name: 'fieldOne',
      type: 'text',
      valuePropName: 'customValueProp',
      customValueProp: 'foo'
    });

    const form = {
      ...defaultForm,
      state: {
        rxRules: formUtils.getFieldRules({ fieldProps, schema })
      }
    };

    const rejected = fieldUtils.validateSync({
      fieldProps,
      fields,
      form
    }).toJS();

    expect(rejected.propsPatch).to.have.property('expected', false);
    expect(rejected).to.have.property('rejectedRules').with.length(1);
    expect(rejected.rejectedRules).to.deep.equal([
      {
        name: 'invalid',
        selector: 'type',
        isCustom: false
      }
    ]);

    const resolved = fieldUtils.validateSync({
      fieldProps: fieldProps.set('customValueProp', 'abc'),
      fields,
      form
    }).toJS();

    expect(resolved.propsPatch).to.have.property('expected', true);
    expect(resolved).to.have.property('rejectedRules').with.length(0);
  });
});
