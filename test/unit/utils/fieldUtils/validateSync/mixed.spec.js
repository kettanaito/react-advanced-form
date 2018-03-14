/**
 * Mixed validation scenarios.
 */
import { expect } from 'chai';
import { fromJS, Map } from 'immutable';
import { form } from '../../../../utils';
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
      ...form,
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
});
