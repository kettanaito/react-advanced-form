import { expect } from 'chai';
import { fromJS, Map } from 'immutable';
import { fieldUtils } from '../../src/utils';

describe('Utils', () => {
  describe('Field utils', () => {
    /**
     * getDynamicProps
     */
    it('getDynamicProps', () => {
      const fieldProps = {
        disabled: false,
        required: () => true
      };

      expect(fieldUtils.getDynamicProps(fieldProps)).to.have.all.keys(['required']);
    });

    /**
     * getErrorMessage
     */
    it('getErrorMessage', () => {
      const messages = fromJS({
        general: {
          missing: 'generalMissing',
          invalid: 'generalInvalid'
        },
        type: {
          tel: {
            invalid: 'fieldTwoInvalid'
          }
        },
        name: {
          fieldOne: {
            missing: 'fieldOneMissing',
            invalid: 'fieldOneInvalid'
          },
          fieldTwo: {
            async: {
              customResolver: ({ fields }) => fields.fieldOne.value
            }
          }
        }
      });

      const fieldOne = Map({ name: 'fieldOne', value: 'foo' });
      const fieldTwo = Map({ name: 'fieldTwo', type: 'tel', value: '999' });
      const fields = fromJS({ fieldOne, fieldTwo });

      /* Name-specific missing message */
      const messageOne = fieldUtils.getErrorMessage({
        validationResult: { errorType: 'missing' },
        messages,
        fieldProps: fieldOne,
      });
      expect(messageOne).to.equal(messages.getIn(['name', 'fieldOne', 'missing']));

      /* Type-specific invalid message */
      const messageTwo = fieldUtils.getErrorMessage({
        validationResult: { errorType: 'invalid' },
        messages,
        fieldProps: fieldTwo
      });
      expect(messageTwo).to.equal(messages.getIn(['type', 'tel', 'invalid']));

      /* Async type-specific message resolver */
      const messageThree = fieldUtils.getErrorMessage({
        validationResult: { errorType: 'async' },
        messages,
        fields,
        fieldProps: fieldTwo
      });
      expect(messageThree).to.equal('foo');
    });

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

      expect(fieldUtils.getValidityState(fieldOne)).to.deep.eq({ valid: false, invalid: true });
      expect(fieldUtils.getValidityState(fieldTwo)).to.deep.eq({ valid: true, invalid: false });
      expect(fieldUtils.getValidityState(fieldThree)).to.deep.eq({ valid: false, invalid: false });
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
    it('serializeFields', () => {
      const fields = fromJS({
        fieldOne: { fieldPath: 'fieldOne', value: 'foo' },
        fieldTwo: { fieldPath: 'fieldTwo', value: '' },
        fieldThree: { fieldPath: 'groupOne.fieldThree', value: 'doe' }
      });

      const serialized = fieldUtils.serializeFields(fields).toJS();

      expect(serialized).to.deep.eq({
        fieldOne: 'foo',
        groupOne: {
          fieldThree: 'doe'
        }
      });
    });

    /**
     * shouldValidate
     */
    it('shouldValidate', () => {
      const optionalField = Map({ validatedSync: false, required: false });
      const requiredField = Map({ validatedSync: false, required: true });
      const dynamicField = Map({ validaredSync: false, required: () => false });

      expect(fieldUtils.shouldValidate(optionalField)).to.be.false;
      expect(fieldUtils.shouldValidate(requiredField)).to.be.true;
      expect(fieldUtils.shouldValidate(dynamicField)).to.be.true;
    });

    /**
     * validateSync
     */
    it('validateSync', () => {
      const fieldOne = Map({ value: '', required: false });
      const fieldTwo = Map({ value: '', required: true });
      const fieldThree = Map({ value: 'foo', required: true });

      /* Rule */
      const fieldFour = Map({ value: '', rule: /^\d+$/, required: false });
      const fieldFive = Map({ value: 'foo', rule: /^\d+$/, required: false });
      const fieldSix = Map({ value: '', rule: /^\d+$/, required: true });
      const fieldSeven = Map({ value: 'foo', rule: /^\d+$/, required: true });
      const fieldEight = Map({ value: '123', rule: /^\d+$/, required: true });
      const fieldNine = Map({ value: '123', rule: /^\d+$/, required: false });
      const fieldTen = Map({ value: '', rule: ({ fields }) => (fields.fieldThree.value === 'foo'), required: false });
      const fieldEleven = Map({ value: '123', rule: ({ fields }) => (fields.fieldThree.value === 'foo'), required: false });

      /* Form rules */
      const fieldTwelve = Map({ type: 'tel', value: '', required: false });
      const fieldThirteen = Map({ type: 'tel', value: 'abc', required: false });
      const fieldFourteen = Map({ type: 'tel', value: '123', required: true });
      const fieldFifteen = Map({ name: 'username', value: 'foo', required: false });
      const fieldSixteen = Map({ name: 'username', value: 'admin', required: false });
      const fieldSeventeen = Map({ name: 'username', value: 'admin', required: true });

      const fields = fromJS({ fieldOne, fieldTwo, fieldThree });

      const formRules = {
        type: {
          tel: ({ value }) => /^\d+$/.test(value)
        },
        name: {
          username: ({ value }) => (value === 'admin')
        }
      };

      /* Optional empty field validation */
      expect(fieldUtils.validateSync({ fieldProps: fieldOne, fields, formRules })).to.deep.eq({ expected: true });

      /* Required empty field validation */
      expect(fieldUtils.validateSync({ fieldProps: fieldTwo, fields, formRules })).to.deep.eq({
        expected: false,
        errorType: 'missing'
      });

      /* Required filled field validation */
      expect(fieldUtils.validateSync({ fieldProps: fieldThree, fields, formRules })).to.deep.eq({ expected: true });

      /* Optional empty field with rule */
      expect(fieldUtils.validateSync({ fieldProps: fieldFour, fields, formRules })).to.deep.eq({ expected: true });

      /* Optional field with rule and value not matching the rule */
      expect(fieldUtils.validateSync({ fieldProps: fieldFive, fields, formRules })).to.deep.eq({
        expected: false,
        errorType: 'invalid'
      });

      /* Required empty value with rule */
      expect(fieldUtils.validateSync({ fieldProps: fieldSix, fields, formRules })).to.deep.eq({
        expected: false,
        errorType: 'missing'
       });

      /* Required field with rule and value not matching the rule */
      expect(fieldUtils.validateSync({ fieldProps: fieldSeven, fields, formRules })).to.deep.eq({
        expected: false,
        errorType: 'invalid'
      });

      /* Required field with rule and value maatching the rule */
      expect(fieldUtils.validateSync({ fieldProps: fieldEight, fields, formRules })).to.deep.eq({ expected: true });

      /* Optional field with rule and value matching the rule */
      expect(fieldUtils.validateSync({ fieldProps: fieldNine, fields, formRules })).to.deep.eq({ expected: true });

      /* Optional empty field with custom rule resolver */
      expect(fieldUtils.validateSync({ fieldProps: fieldTen, fields, formRules })).to.deep.eq({ expected: true });

      /* Optional field with custom rule resovler and resolved */
      expect(fieldUtils.validateSync({ fieldProps: fieldEleven, fields, formRules })).to.deep.eq({ expected: true });

      /* Form type rule: Optional empty field */
      expect(fieldUtils.validateSync({ fieldProps: fieldTwelve, fields, formRules })).to.deep.eq({ expected: true });

      /* Form type rule: Field with rule not matching */
      expect(fieldUtils.validateSync({ fieldProps: fieldThirteen, fields, formRules })).to.deep.eq({
        expected: false,
        errorType: 'invalid'
      });

      /* Form type rule: Required field with value matching */
      expect(fieldUtils.validateSync({ fieldProps: fieldFourteen, fields, formRules })).to.deep.eq({ expected: true });

      /* Form name rule: Optional field with unexpected value */
      expect(fieldUtils.validateSync({ fieldProps: fieldFifteen, fields, formRules })).to.deep.eq({
        expected: false,
        errorType: 'invalid'
      });

      /* Form name rule: Optional field with expected value */
      expect(fieldUtils.validateSync({ fieldProps: fieldSixteen, fields, formRules })).to.deep.eq({ expected: true });

      /* Form name rule: Required field with expected value */
      expect(fieldUtils.validateSync({ fieldProps: fieldSeventeen, fields, formRules })).to.deep.eq({ expected: true });
    });
  });
});
