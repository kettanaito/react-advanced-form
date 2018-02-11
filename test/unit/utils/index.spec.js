import { expect } from 'chai';
import { fromJS, Map } from 'immutable';
import { fieldUtils } from '../../../src/utils';

describe('utils', () => {
  describe('fieldUtils', () => {
    /**
     * getRxProps
     */
    it('getRxProps', () => {
      const fieldProps = {
        disabled: false,
        required: () => true
      };

      expect(fieldUtils.getRxProps(fieldProps).toJS()).to.have.all.keys(['required']);
    });

    /**
     * getErrorMessages
     */
    // require('./getErrorMessages.spec');

    /**
     * getFieldPath
     */
    it('getFieldPath', () => {
      const fieldOne = { name: 'fieldOne' };
      const fieldTwo = { fieldGroup: 'groupOne', name: 'fieldTwo' };

      expect(fieldUtils.getFieldPath(fieldOne)).to.eq('fieldOne');
      expect(fieldUtils.getFieldPath(fieldTwo)).to.eq('groupOne.fieldTwo');
    });

    /**
     * getFieldProps
     */
    it('getFieldProps', () => {
      const fields = fromJS({ fieldOne: { value: 'context' } });
      const fallbackProps = { value: 'fallback' };

      expect(fieldUtils.getFieldProps('fieldOne', fields, fallbackProps)).to.deep.eq(fields.get('fieldOne').toJS());
      expect(fieldUtils.getFieldProps('fieldTwo', fields, fallbackProps)).to.deep.eq(fallbackProps);
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

      expect(fieldUtils.getValidityState(fieldOne).toJS()).to.deep.eq({ valid: false, invalid: true });
      expect(fieldUtils.getValidityState(fieldTwo).toJS()).to.deep.eq({ valid: true, invalid: false });
      expect(fieldUtils.getValidityState(fieldThree).toJS()).to.deep.eq({ valid: false, invalid: false });
    });

    /**
     * resolveProp
     */
    it('resolveProp', () => {
      const fieldOne = { disabled: true, value: 'foo' };
      const fieldTwo = { required: ({ fields }) => fields.fieldOne.disabled };
      const fields = fromJS({ fieldOne, fieldTwo });

      expect(fieldUtils.resolveProp({ propName: 'value', fieldProps: fieldOne })).to.equal('foo');
      expect(fieldUtils.resolveProp({ propName: 'required', fieldProps: fieldTwo, fields })).to.equal(true);
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
});
