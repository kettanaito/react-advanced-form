/**
 * Name-specific validation.
 */
import { expect } from 'chai';
import { fromJS, Map } from 'immutable';
import { form } from '../../../../utils';
import { fieldUtils } from '../../../../../src/utils';

describe('Name-specific validation', () => {
  const fields = Map({});

  it('Functional rule', () => {
    const formRules = fromJS({
      name: {
        fieldName: ({ value }) => /^\d+$/.test(value)
      }
    });

    const fieldProps = Map({
      name: 'fieldName',
      type: 'text',
      valuePropName: 'value'
    });

    const resultOne = fieldUtils.validateSync({
      fieldProps: fieldProps.set('value', 'letters'),
      fields,
      form,
      formRules
    }).toJS();

    expect(resultOne).to.include.keys(['rejectedRules', 'propsPatch']);
    expect(resultOne.propsPatch).to.have.property('expected', false);
    expect(resultOne).to.have.property('rejectedRules').with.length(1);
    expect(resultOne).to.have.property('rejectedRules').to.deep.equal([
      {
        name: 'invalid',
        selector: 'name',
        isCustom: false
      }
    ]);

    const resultTwo = fieldUtils.validateSync({
      fieldProps: fieldProps.set('value', '123'),
      fields,
      form,
      formRules
    }).toJS();

    expect(resultTwo.propsPatch).to.have.property('expected', true);
    expect(resultTwo).to.have.property('rejectedRules').with.length(0);
  });

  it('Multiple named rules', () => {
    const formRules = fromJS({
      name: {
        fieldName: {
          capitalLetter: ({ value }) => /[A-Z]/.test(value),
          oneNumber: ({ value }) => /[0-9]/.test(value)
        }
      }
    });

    const fieldProps = Map({
      name: 'fieldName',
      type: 'text',
      valuePropName: 'value'
    });

    /**
     * Unexpected field (0/2).
     */
    const resultOne = fieldUtils.validateSync({
      fieldProps: fieldProps.set('value', 'foo'),
      fields,
      form,
      formRules
    }).toJS();

    expect(resultOne.propsPatch).to.have.property('expected', false);
    expect(resultOne).to.have.property('rejectedRules').with.length(2);
    expect(resultOne.rejectedRules).to.deep.equal([
      {
        name: 'capitalLetter',
        selector: 'name',
        isCustom: true
      },
      {
        name: 'oneNumber',
        selector: 'name',
        isCustom: true
      }
    ]);

    /**
     * Unexpected field (1/2).
     */
    const resultTwo = fieldUtils.validateSync({
      fieldProps: fieldProps.set('value', 'Capital'),
      fields,
      form,
      formRules
    }).toJS();

    expect(resultTwo.propsPatch).to.have.property('expected', false);
    expect(resultTwo).to.have.property('rejectedRules').with.length(1);
    expect(resultTwo.rejectedRules).to.deep.equal([
      {
        name: 'oneNumber',
        selector: 'name',
        isCustom: true
      }
    ]);

    /**
     * Expected field (2/2).
     */
    const resultThree = fieldUtils.validateSync({
      fieldProps: fieldProps.set('value', 'Capi5tal'),
      fields,
      form,
      formRules
    }).toJS();

    expect(resultThree.propsPatch).to.have.property('expected', true);
    expect(resultThree).to.have.property('rejectedRules').with.length(0);
  });
});
