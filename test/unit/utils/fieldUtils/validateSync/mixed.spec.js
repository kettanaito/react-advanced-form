/**
 * Mixed validation scenarios.
 */
import { expect } from 'chai';
import { fromJS, Map } from 'immutable';
import { form as defaultForm } from '../../../../utils';
import { formUtils, fieldUtils } from '../../../../../src/utils';

describe('Mixed validation', function () {
  const fields = Map({});

  it('Name-specific rules are prior to type-specific rule', () => {
    const schema = fromJS({
      type: {
        text: ({ value }) => (value.length < 5)
      },
      name: {
        fieldName: {
          namedRule: ({ value }) => (value !== 'foo')
        }
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

    const resultOne = fieldUtils.validateSync({
      fieldProps: fieldProps.set('value', 'foo'),
      fields,
      form
    }).toJS();

    expect(resultOne.propsPatch).to.have.property('expected', false);
    expect(resultOne).to.have.property('rejectedRules').with.length(1);
    expect(resultOne.rejectedRules).to.deep.equal([
      {
        name: 'namedRule',
        selector: 'name',
        isCustom: true
      }
    ]);

    const resulTwo = fieldUtils.validateSync({
      fieldProps: fieldProps.set('value', '1234567890'),
      fields,
      form
    }).toJS();

    expect(resulTwo.propsPatch).to.have.property('expected', false);
    expect(resulTwo).to.have.property('rejectedRules').with.length(1);
    expect(resulTwo.rejectedRules).to.deep.equal([
      {
        name: 'invalid',
        selector: 'type',
        isCustom: false
      }
    ]);

    const resultThree = fieldUtils.validateSync({
      fieldProps: fieldProps.set('value', '4'),
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
          return (customValueProp !== 'abc');
        }
      },
      name: {
        fieldOne: ({ customValueProp }) => {
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
        selector: 'name',
        isCustom: false
      }
    ]);

    const resolved = fieldUtils.validateSync({
      fieldProps: fieldProps.set('customValueProp', '123'),
      fields,
      form
    }).toJS();

    expect(resolved.propsPatch).to.have.property('expected', true);
    expect(resolved).to.have.property('rejectedRules').with.length(0);
  });
});
