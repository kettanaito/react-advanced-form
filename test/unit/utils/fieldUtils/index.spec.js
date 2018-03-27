import { expect } from 'chai';
import { Map } from 'immutable';
import { fieldUtils } from '../../../../src/utils';

describe('fieldUtils', function () {
  /**
   * getValidityState
   */
  it('getValidityState', () => {
    /* Invalid field */
    const fieldOne = Map({
      expected: false,
      value: 'foo',
      valuePropName: 'value',
      validatedSync: true,
      validatedAsync: true
    });

    /* Valid field */
    const fieldTwo = Map({
      expected: true,
      value: 'foo',
      valuePropName: 'value',
      validatedSync: true,
      validatedAsync: false
    });

    /* Not valid, neither invalid field */
    const fieldThree = Map({
      expected: true,
      value: '',
      valuePropName: 'value',
      validatedSync: true,
      validatedAsync: false
    });

    expect(fieldUtils.getValidityState({
      fieldProps: fieldOne,
      needsValidation: true
    }).toJS()).to.deep.equal({ valid: false, invalid: true });

    expect(fieldUtils.getValidityState({
      fieldProps: fieldOne,
      needsValidation: false
    }).toJS()).to.deep.equal({ valid: false, invalid: false });

    expect(fieldUtils.getValidityState({
      fieldProps: fieldTwo,
      needsValidation: true
    }).toJS()).to.deep.equal({ valid: true, invalid: false });

    expect(fieldUtils.getValidityState({
      fieldProps: fieldThree,
      needsValidation: true
    }).toJS()).to.deep.equal({ valid: false, invalid: false });
  });

  /**
   * serializeFields
   */
  require('./serializeFields.spec');

  /**
   * Synchronous validation.
   */
  require('./validateSync');
});