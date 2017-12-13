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
    expect(await fieldUtils.validateAsync({
      fieldProps: Map({
        value: '',
        required: false
      }),
      fields
    })).to.deep.eq({
      expected: true
    });
  });

  /**
   * Empty optional field with async rule is considered expected.
   */
  it('empty optional field is expected', async () => {
    expect(await fieldUtils.validateAsync({
      fieldProps: Map({
        value: '',
        asyncRule,
        required: false
      }),
      fields
    })).to.deep.eq({
      expected: true
    });
  });

  /**
   * Empty, although required, field is considered expected in async validation only.
   */
  it('empty required field is expected', async () => {
    expect(await fieldUtils.validateAsync({
      fieldProps: Map({
        value: '',
        asyncRule,
        required: true
      }),
      fields
    })).to.deep.eq({
      expected: true
    });
  });

  /**
   * Optional filled field.
   */
  it('optional filled field (matching) is expected', async () => {
    expect(await fieldUtils.validateAsync({
      fieldProps: Map({
        value: '123',
        asyncRule,
        required: false
      }),
      fields
    })).to.deep.eq({
      expected: true
    });
  });

  it('optional filled field (not matching) is unexpected', async () => {
    expect(await fieldUtils.validateAsync({
      fieldProps: Map({
        value: 'abc',
        asyncRule,
        required: false
      }),
      fields
    })).to.deep.eq({
      expected: false,
      errorType: 'async'
    });
  });

  it('required filled field (matching) is expected', async () => {
    expect(await fieldUtils.validateAsync({
      fieldProps: Map({
        value: '123',
        asyncRule,
        required: true
      }),
      fields
    })).to.deep.eq({
      expected: true
    });
  });

  it('required filled field (not matching) is unexpected', async () => {
    expect(await fieldUtils.validateAsync({
      fieldProps: Map({
        value: 'abc',
        asyncRule,
        required: true
      }),
      fields
    })).to.deep.eq({
      expected: false,
      errorType: 'async'
    });
  });

  it('unexpected field propagates "extra" properties', async () => {
    expect(await fieldUtils.validateAsync({
      fieldProps: Map({
        value: 'abc',
        asyncRule: () => new Promise(resolve => resolve({
          valid: false,
          myCustomProp: 1
        })),
        required: true
      }),
      fields
    })).to.deep.eq({
      expected: false,
      errorType: 'async',
      extra: {
        myCustomProp: 1
      }
    });
  });

  it('asyncRule based on "fields"', async () => {
    expect(await fieldUtils.validateAsync({
      fieldProps: Map({
        value: 'abc',
        asyncRule: ({ fields }) => new Promise(resolve => resolve({
          valid: (fields.fieldOne.value === 'foo')
        })),
        required: true
      }),
      fields
    })).to.deep.eq({
      expected: true
    });
  });
});
