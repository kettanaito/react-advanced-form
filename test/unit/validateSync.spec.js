/**
 * Synchronous validation.
 */
import { expect } from 'chai';
import { fromJS, Map } from 'immutable';
import { fieldUtils } from '../../src/utils';

describe('validateSync', () => {
  const fields = fromJS({
    anotherField: Map({
      value: 'foo',
      required: true
    })
  });

  const formRules = fromJS({
    type: {
      tel: ({ value }) => /^\d+$/.test(value)
    },
    name: {
      username: ({ value }) => (value === 'admin')
    }
  });

  it('empty field (optional)', () => {
    expect(fieldUtils.validateSync({
      fieldProps: Map({
        value: '',
        required: false
      }),
      fields,
      formRules
    })).to.deep.eq({
      expected: true
    });
  });

  it('empty field (required)', () => {
    expect(fieldUtils.validateSync({
      fieldProps: Map({
        value: '',
        required: true
      }),
      fields,
      formRules
    })).to.deep.eq({
      expected: false,
      errorType: 'missing'
    });
  });

  it('filled field (required)', () => {
    expect(fieldUtils.validateSync({
      fieldProps: Map({
        value: 'foo',
        required: true
      }),
      fields,
      formRules
    })).to.deep.eq({ expected: true });
  });

  it('optional field with rule', () => {
    expect(fieldUtils.validateSync({
      fieldProps: Map({
        value: '',
        rule: /^\d+$/,
        required: false
      }),
      fields,
      formRules
    })).to.deep.eq({
      expected: true
    });
  });

  it('optional field with rule (not matching)', () => {
    expect(fieldUtils.validateSync({
      fieldProps: Map({
        value: 'foo',
        rule: /^\d+$/,
        required: false
      }),
      fields,
      formRules
    })).to.deep.eq({
      expected: false,
      errorType: 'invalid'
    });
  });

  it('empty require field with rule', () => {
    /* Required empty value with rule */
    expect(fieldUtils.validateSync({
      fieldProps: Map({
        value: '',
        rule: /^\d+$/,
        required: true
      }),
      fields,
      formRules
    })).to.deep.eq({
      expected: false,
      errorType: 'missing'
    });
  });

  it('filled required field with rule (not matching)', () => {
    expect(fieldUtils.validateSync({
      fieldProps: Map({
        value: 'foo',
        rule: /^\d+$/,
        required: true
      }),
      fields,
      formRules
    })).to.deep.eq({
      expected: false,
      errorType: 'invalid'
    });
  });

  it('filled required field with rule (matching)', () => {
    expect(fieldUtils.validateSync({
      fieldProps: Map({
        value: '123',
        rule: /^\d+$/,
        required: true
      }),
      fields,
      formRules
    })).to.deep.eq({
      expected: true
    });
  });

  it('filled optional field with rule (matching)', () => {
    expect(fieldUtils.validateSync({
      fieldProps: Map({
        value: '123',
        rule: /^\d+$/,
        required: false
      }),
      fields,
      formRules
    })).to.deep.eq({
      expected: true
    });
  });

  it('empty optional field with custom rule resolver', () => {
    expect(fieldUtils.validateSync({
      fieldProps: Map({
        value: '',
        rule: ({ fields }) => (fields.anotherField.value === 'foo'),
        required: false
      }),
      fields,
      formRules
    })).to.deep.eq({
      expected: true
    });
  });

  it('filled optional field with custom rule resolver (matching)', () => {
    expect(fieldUtils.validateSync({
      fieldProps: Map({
        value: '123',
        rule: ({ fields }) => (fields.anotherField.value === 'foo'),
        required: false
      }),
      fields,
      formRules
    })).to.deep.eq({
      expected: true
    });
  });

  it('empty optional field (form rule)', () => {
    expect(fieldUtils.validateSync({
      fieldProps: Map({
        type: 'tel',
        value: '',
        required: false
      }),
      fields,
      formRules
    })).to.deep.eq({ expected: true });
  });

  it('filled optional field (form rule not matching)', () => {
    expect(fieldUtils.validateSync({
      fieldProps: Map({
        type: 'tel',
        value: 'abc',
        required: false
      }),
      fields,
      formRules
    })).to.deep.eq({
      expected: false,
      errorType: 'invalid'
    });
  });

  it('filled required field (form rule matching)', () => {
    expect(fieldUtils.validateSync({
      fieldProps: Map({
        type: 'tel',
        value: '123',
        required: true
      }),
      fields,
      formRules
    })).to.deep.eq({
      expected: true
    });
  });

  it('optional filled field (form rule not matching)', () => {
    expect(fieldUtils.validateSync({
      fieldProps: Map({
        name: 'username',
        value: 'foo',
        required: false
      }),
      fields,
      formRules
    })).to.deep.eq({
      expected: false,
      errorType: 'invalid'
    });
  });

  it('filled optional field (form rule matching)', () => {
    expect(fieldUtils.validateSync({
      fieldProps: Map({
        name: 'username',
        value: 'admin',
        required: false
      }),
      fields,
      formRules
    })).to.deep.eq({
      expected: true
    });
  });

  it('filled required field (form rule matching)', () => {
    expect(fieldUtils.validateSync({
      fieldProps: Map({
        name: 'username',
        value: 'admin',
        required: true
      }),
      fields,
      formRules
    })).to.deep.eq({
      expected: true
    });
  });
});
