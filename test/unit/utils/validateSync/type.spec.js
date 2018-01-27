/**
 * Type-specific validation.
 */
import { expect } from 'chai';
import { fromJS, Map } from 'immutable';
import { fieldUtils } from '../../../../src/utils';

describe('Type-specific validation', () => {
  const fields = fromJS({
    anotherField: Map({
      value: 'foo',
      required: true
    })
  });

  it('Functional rule', () => {
    const fieldProps = Map({ name: 'fieldName', type: 'text' });

    const resultOne = fieldUtils.validateSync({
      fieldProps: fieldProps.set('value', 'letters'),
      fields,
      formRules: fromJS({
        type: {
          text: ({ value }) => /^\d+$/.test(value)
        }
      })
    }).toJS();

    expect(resultOne).to.have.all.keys(['errorPaths', 'propsPatch']);
    expect(resultOne.propsPatch).to.have.property('expected', false);
    expect(resultOne).to.have.property('errorPaths').with.length(1);
    expect(resultOne).to.have.property('errorPaths').to.deep.equal([
      ['type', fieldProps.get('type'), 'invalid']
    ]);

    const resultTwo = fieldUtils.validateSync({
      fieldProps: fieldProps.set('value', 'example@domain.com'),
      fields,
      formRules: fromJS({
        type: {
          email: ({ value }) => value.includes('@')
        }
      })
    }).toJS();

    expect(resultTwo.propsPatch).to.have.property('expected', true);
    expect(resultTwo).to.have.property('errorPaths').with.length(0);
  });

  it('Multiple named rules', () => {
    const formRules = fromJS({
      type: {
        password: {
          capitalLetter: ({ value }) => /[A-Z]/.test(value),
          oneNumber: ({ value }) => /[0-9]/.test(value)
        }
      }
    });

    const fieldProps = Map({ name: 'fieldName', type: 'password' });

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
      ['type', fieldProps.get('type'), 'rules', 'capitalLetter'],
      ['type', fieldProps.get('type'), 'rules', 'oneNumber']
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
      ['type', fieldProps.get('type'), 'rules', 'oneNumber']
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
