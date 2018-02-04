/**
 * Asynchronous validation.
 */
import { expect } from 'chai';
import { fromJS, Map } from 'immutable';
import { fieldUtils } from '../../../src/utils';

const asyncRule = ({ value }) => new Promise((resolve, reject) => {
  setTimeout(resolve({
    valid: /^\d+$/.test(value)
  }), 250);
});

const fields = fromJS({
  fieldOne: { value: 'foo' },
});

describe('validateAsync', () => {
  /**
   * Field without asyncRule is bypassed (considered expected).
   */
  it('field witout asyncRule is expected', async () => {
    const result = await fieldUtils.validateAsync({
      fieldProps: Map({
        value: '',
        required: false
      }),
      fields
    });

    expect(result.getIn(['propsPatch', 'expected'])).to.be.true;
    expect(result.get('rejectedRules')).to.have.lengthOf(0);
  });

  /**
   * Empty optional field with async rule is considered expected.
   */
  it('empty optional field is expected', async () => {
    const result = await fieldUtils.validateAsync({
      fieldProps: Map({
        value: '',
        asyncRule,
        required: false
      }),
      fields
    });

    expect(result.getIn(['propsPatch', 'expected'])).to.be.true;
    expect(result.get('rejectedRules')).to.have.lengthOf(0);
  });

  /**
   * Empty, although required, field is considered expected in async validation only.
   */
  it('empty required field is expected', async () => {
    const result = await fieldUtils.validateAsync({
      fieldProps: Map({
        value: '',
        asyncRule,
        required: true
      }),
      fields
    });

    expect(result.getIn(['propsPatch', 'expected'])).to.be.true;
    expect(result.get('rejectedRules')).to.have.lengthOf(0);
  });

  /**
   * Optional filled field.
   */
  it('optional filled field (matching) is expected', async () => {
    const result = await fieldUtils.validateAsync({
      fieldProps: Map({
        value: '123',
        asyncRule,
        required: false
      }),
      fields
    });

    expect(result.getIn(['propsPatch', 'expected'])).to.be.true;
    expect(result.get('rejectedRules')).to.have.lengthOf(0);
  });

  it('optional not matching field is unexpected', async () => {
    const result = await fieldUtils.validateAsync({
      fieldProps: Map({
        value: 'abc',
        asyncRule,
        required: false
      }),
      fields
    });

    expect(result.getIn(['propsPatch', 'expected'])).to.be.false;
    expect(result.get('rejectedRules')).to.deep.equal([
      {
        name: 'async',
        selector: null,
        isCustom: false
      }
    ]);
  });

  it('required filled field (matching) is expected', async () => {
    const result = await fieldUtils.validateAsync({
      fieldProps: Map({
        value: '123',
        asyncRule,
        required: true
      }),
      fields
    });

    expect(result.getIn(['propsPatch', 'expected'])).to.be.true;
    expect(result.get('rejectedRules')).to.have.lengthOf(0);
  });

  it('required filled field (not matching) is unexpected', async () => {
    const result = await fieldUtils.validateAsync({
      fieldProps: Map({
        value: 'abc',
        asyncRule,
        required: true
      }),
      fields
    });

    expect(result.getIn(['propsPatch', 'expected'])).to.be.false;
    expect(result.get('rejectedRules')).to.deep.equal([
      {
        name: 'async',
        selector: null,
        isCustom: false
      }
    ]);
  });

  it('unexpected field propagates "extra" properties', async () => {
    const result = await fieldUtils.validateAsync({
      fieldProps: Map({
        value: 'abc',
        asyncRule: () => new Promise(resolve => resolve({
          valid: false,
          myCustomProp: 1
        })),
        required: true
      }),
      fields
    });

    expect(result.getIn(['propsPatch', 'expected'])).to.be.false;
    expect(result.get('extra')).to.deep.equal({ myCustomProp: 1 });
    expect(result.get('rejectedRules')).to.deep.equal([
      {
        name: 'async',
        selector: null,
        isCustom: false
      }
    ]);
  });

  it('asyncRule based on "fields"', async () => {
    const result = await fieldUtils.validateAsync({
      fieldProps: Map({
        value: 'abc',
        asyncRule: ({ fields }) => new Promise(resolve => resolve({
          valid: (fields.fieldOne.value === 'foo')
        })),
        required: true
      }),
      fields
    });

    expect(result.getIn(['propsPatch', 'expected'])).to.be.true;
    expect(result.get('rejectedRules')).to.have.lengthOf(0);
  });
});
