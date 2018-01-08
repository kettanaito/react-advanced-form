import { expect } from 'chai';
import { fromJS, Map } from 'immutable';
import { fieldUtils } from '../../../src/utils';
import { BothValidationType, SyncValidationType } from '../../../src/ValidationType';

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

      expect(fieldUtils.getDynamicProps(fieldProps).toJS()).to.have.all.keys(['required']);
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
        fieldOne: { fieldPath: 'fieldOne', value: 'foo', valuePropName: 'value' },
        fieldTwo: { fieldPath: 'fieldTwo', value: '', valuePropName: 'value' },
        fieldThree: { fieldPath: 'groupOne.fieldThree', value: 'doe', valuePropName: 'value' }
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
      const dynamicRequiredField = Map({ validaredSync: false, required: () => false });
      const validatedField = Map({ validatedSync: true });
      const requiredField = Map({ validatedSync: false, required: true });
      const optionalField = Map({ validatedSync: false, required: false });
      const optionalFieldWithNameRule = Map({ name: 'field', required: false, value: 'foo '});
      const optionalFieldWithTypeRule = Map({ type: 'text', name: 'field', required: false, value: 'foo '});

      expect(fieldUtils.shouldValidate({
        validationType: BothValidationType,
        fieldProps: dynamicRequiredField,
        formRules: Map()
      })).to.be.true;

      expect(fieldUtils.shouldValidate({
        validationType: BothValidationType,
        fieldProps: validatedField,
        formRules: Map()
      })).to.be.false;

      expect(fieldUtils.shouldValidate({
        validationType: BothValidationType,
        fieldProps: requiredField,
        formRules: Map()
      })).to.be.true;

      expect(fieldUtils.shouldValidate({
        validationType: BothValidationType,
        fieldProps: optionalField,
        formRules: Map()
      })).to.be.false;

      expect(fieldUtils.shouldValidate({
        validationType: BothValidationType,
        fieldProps: optionalFieldWithNameRule,
        formRules: fromJS({
          name: {
            field: ({ value }) => (value !== 'foo')
          }
        })
      })).to.be.true;

      expect(fieldUtils.shouldValidate({
        validationType: BothValidationType,
        fieldProps: optionalFieldWithTypeRule,
        formRules: fromJS({
          type: {
            text: ({ value }) => (value !== 'foo')
          }
        })
      })).to.be.true;

    });

    /**
     * Synchronous validation.
     */
    require('./validateSync.spec');

    /**
     * Asynchronous validation.
     */
    require('./validateAsync.spec');
  });
});
