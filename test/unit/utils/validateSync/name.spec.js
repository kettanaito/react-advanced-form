/**
 * Name-specific validation.
 */
import { expect } from 'chai';
import { fromJS, Map } from 'immutable';
import { fieldUtils } from '../../../../src/utils';

describe('Name-specific validation', () => {
  const fields = Map({});

  it('Functional rule', () => {
    const formRules = fromJS({
      name: {
        fieldName: ({ value }) => /^\d+$/.test(value)
      }
    });

    const fieldProps = Map({ name: 'fieldName', type: 'text' });

    const resultOne = fieldUtils.validateSync({
      fieldProps: fieldProps.set('value', 'letters'),
      fields,
      formRules
    }).toJS();

    expect(resultOne).to.have.all.keys(['errorPaths', 'propsPatch']);
    expect(resultOne.propsPatch).to.have.property('expected', false);
    expect(resultOne).to.have.property('errorPaths').with.length(1);
    expect(resultOne).to.have.property('errorPaths').to.deep.equal([
      ['name', 'fieldName', 'invalid']
    ]);

    const resultTwo = fieldUtils.validateSync({
      fieldProps: fieldProps.set('value', '123'),
      fields,
      formRules
    }).toJS();

    expect(resultTwo.propsPatch).to.have.property('expected', true);
    expect(resultTwo).to.have.property('errorPaths').with.length(0);
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

    const fieldProps = Map({ name: 'fieldName', type: 'text' });

    /**
     * Unexpected field (0/2).
     */
    const resultOne = fieldUtils.validateSync({
      fieldProps: fieldProps.set('value', 'foo'),
      fields,
      formRules
    }).toJS();

    expect(resultOne.propsPatch).to.have.property('expected', false);
    expect(resultOne).to.have.property('errorPaths').with.length(2);
    expect(resultOne.errorPaths).to.deep.equal([
      ['name', 'fieldName', 'rules', 'capitalLetter'],
      ['name', 'fieldName', 'rules', 'oneNumber']
    ]);

    /**
     * Unexpected field (1/2).
     */
    const resultTwo = fieldUtils.validateSync({
      fieldProps: fieldProps.set('value', 'Capital'),
      fields,
      formRules
    }).toJS();

    expect(resultTwo.propsPatch).to.have.property('expected', false);
    expect(resultTwo).to.have.property('errorPaths').with.length(1);
    expect(resultTwo.errorPaths).to.deep.equal([
      ['name', 'fieldName', 'rules', 'oneNumber']
    ]);

    /**
     * Expected field (2/2).
     */
    const resultThree = fieldUtils.validateSync({
      fieldProps: fieldProps.set('value', 'Capi5tal'),
      fields,
      formRules
    }).toJS();

    expect(resultThree.propsPatch).to.have.property('expected', true);
    expect(resultThree).to.have.property('errorPaths').with.length(0);
  });
});
