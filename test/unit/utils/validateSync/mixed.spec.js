/**
 * Mixed validation scenarios.
 */
import { expect } from 'chai';
import { fromJS, Map } from 'immutable';
import { fieldUtils } from '../../../../src/utils';

describe('Mixed validation', function () {
  const fields = Map({});

  it('Name-specific rules are prior to type-specific rule', () => {
    const formRules = fromJS({
      type: {
        text: ({ value }) => (value.length < 5)
      },
      name: {
        fieldName: {
          namedRule: ({ value }) => (value !== 'foo')
        }
      }
    });

    const fieldProps = Map({ name: 'fieldName', type: 'text' });

    const resultOne = fieldUtils.validateSync({
      fieldProps: fieldProps.set('value', 'foo'),
      fields,
      formRules
    }).toJS();

    expect(resultOne.propsPatch).to.have.property('expected', false);
    expect(resultOne).to.have.property('errorPaths').with.length(1);
    expect(resultOne.errorPaths).to.deep.equal([
      ['name', fieldProps.get('name'), 'rules', 'namedRule']
    ]);

    const resulTwo = fieldUtils.validateSync({
      fieldProps: fieldProps.set('value', '1234567890'),
      fields,
      formRules
    }).toJS();

    expect(resulTwo.propsPatch).to.have.property('expected', false);
    expect(resulTwo).to.have.property('errorPaths').with.length(1);
    expect(resulTwo.errorPaths).to.deep.equal([
      ['type', 'text', 'invalid']
    ]);
  });
});
