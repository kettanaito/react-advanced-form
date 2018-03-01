import { expect } from 'chai';
import { Map } from 'immutable';
import { fieldUtils } from '../../../../src/utils';

describe('fieldUtils', function () {
  /**
   * getFieldPath
   */
  it('getFieldPath', () => {
    const fieldOne = { name: 'fieldOne' };
    const fieldTwo = { fieldGroup: 'groupOne', name: 'fieldTwo' };

    expect(fieldUtils.getFieldPath(fieldOne)).to.deep.eq(['fieldOne']);
    expect(fieldUtils.getFieldPath(fieldTwo)).to.deep.eq(['groupOne', 'fieldTwo']);
  });

  /**
   * getValidityState
   */
  it('getValidityState', () => {
    /* Invalid field */
    const fieldOne = Map({
      expected: false,
      value: 'foo',
      validatedSync: true,
      validatedAsync: true
    });

    /* Valid field */
    const fieldTwo = Map({
      expected: true,
      value: 'foo',
      validatedSync: true,
      validatedAsync: false
    });

    /* Not valid, neither invalid field */
    const fieldThree = Map({
      expected: true,
      value: '',
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