/**
 * Synchronous validation.
 */
import { fromJS, Map } from 'immutable';

describe('validateSync', () => {
  /* Type-specific validation */
  require('./type.spec');

  /* Name-specific validation */
  require('./name.spec');

  /* Mixed validation */
  require('./mixed.spec');

  // it('Validates by form type rules', () => {
  //   const formRules = fromJS({
  //     type: {
  //       email: ({ value }) => (value === '123'),
  //       password: {
  //         minLength: ({ value }) => (value.length > 5),
  //         capitalLetter: ({ value }) => /[A-Z]/.test(value)
  //       }
  //     }
  //   });

  //   const firstField = Map({ name: 'a1', type: 'email', value: '456' });
  //   const secondField = Map({ name: 'a2', type: 'password', value: 'sOme' });

  //   expect(fieldUtils.validateSync({
  //     fieldProps: secondField,
  //     fields,
  //     formRules
  //   }).toJS()).to.deep.equal({
  //     expect: false,
  //     errorPaths: [['type', 'password', 'rules', 'minLength']]
  //   });
  // });

  /**
   * ====================================================================================
   */

  // const formRules = fromJS({
  //   type: {
  //     tel: ({ value }) => /^\d+$/.test(value)
  //   },
  //   name: {
  //     username: {
  //       isAdmin: ({ value }) => (value === 'admin')
  //     }
  //   }
  // });

  // it('empty optional field is expected', () => {
  //   expect(fieldUtils.validateSync({
  //     fieldProps: Map({
  //       value: '',
  //       required: false
  //     }),
  //     fields,
  //     formRules
  //   })).to.deep.eq({
  //     expected: true
  //   });
  // });

  // it('empty required fields is unexpected', () => {
  //   expect(fieldUtils.validateSync({
  //     fieldProps: Map({
  //       value: '',
  //       required: true
  //     }),
  //     fields,
  //     formRules
  //   })).to.deep.eq({
  //     expected: false,
  //     errorType: ['missing']
  //   });
  // });

  // it('filled required field is expected', () => {
  //   expect(fieldUtils.validateSync({
  //     fieldProps: Map({
  //       value: 'foo',
  //       required: true
  //     }),
  //     fields,
  //     formRules
  //   })).to.deep.eq({
  //     expected: true
  //   });
  // });

  // it('optional empty field with rule is expected', () => {
  //   expect(fieldUtils.validateSync({
  //     fieldProps: Map({
  //       value: '',
  //       rule: /^\d+$/,
  //       required: false
  //     }),
  //     fields,
  //     formRules
  //   })).to.deep.eq({
  //     expected: true
  //   });
  // });

  // it('optional field with rule (not matching) is unexepcted', () => {
  //   expect(fieldUtils.validateSync({
  //     fieldProps: Map({
  //       value: 'foo',
  //       rule: /^\d+$/,
  //       required: false
  //     }),
  //     fields,
  //     formRules
  //   })).to.deep.eq({
  //     expected: false,
  //     errorType: ['invalid']
  //   });
  // });

  // it('empty require field with rule is unexpected', () => {
  //   /* Required empty value with rule */
  //   expect(fieldUtils.validateSync({
  //     fieldProps: Map({
  //       value: '',
  //       rule: /^\d+$/,
  //       required: true
  //     }),
  //     fields,
  //     formRules
  //   })).to.deep.eq({
  //     expected: false,
  //     errorType: ['missing']
  //   });
  // });

  // it('filled required field with rule (not matching) is unexpected', () => {
  //   expect(fieldUtils.validateSync({
  //     fieldProps: Map({
  //       value: 'foo',
  //       rule: /^\d+$/,
  //       required: true
  //     }),
  //     fields,
  //     formRules
  //   })).to.deep.eq({
  //     expected: false,
  //     errorType: ['invalid']
  //   });
  // });

  // it('filled required field with rule (matching) is expected', () => {
  //   expect(fieldUtils.validateSync({
  //     fieldProps: Map({
  //       value: '123',
  //       rule: /^\d+$/,
  //       required: true
  //     }),
  //     fields,
  //     formRules
  //   })).to.deep.eq({
  //     expected: true
  //   });
  // });

  // it('filled optional field with rule (matching) is expected', () => {
  //   expect(fieldUtils.validateSync({
  //     fieldProps: Map({
  //       value: '123',
  //       rule: /^\d+$/,
  //       required: false
  //     }),
  //     fields,
  //     formRules
  //   })).to.deep.eq({
  //     expected: true
  //   });
  // });

  // it('empty optional field with custom rule resolver is expected', () => {
  //   expect(fieldUtils.validateSync({
  //     fieldProps: Map({
  //       value: '',
  //       rule: ({ fields }) => (fields.anotherField.value === 'foo'),
  //       required: false
  //     }),
  //     fields,
  //     formRules
  //   })).to.deep.eq({
  //     expected: true
  //   });
  // });

  // it('filled optional field with custom rule resolver (matching) is expected', () => {
  //   expect(fieldUtils.validateSync({
  //     fieldProps: Map({
  //       value: '123',
  //       rule: ({ fields }) => (fields.anotherField.value === 'foo'),
  //       required: false
  //     }),
  //     fields,
  //     formRules
  //   })).to.deep.eq({
  //     expected: true
  //   });
  // });

  // it('empty optional field (form rule)is expected', () => {
  //   expect(fieldUtils.validateSync({
  //     fieldProps: Map({
  //       type: 'tel',
  //       value: '',
  //       required: false
  //     }),
  //     fields,
  //     formRules
  //   })).to.deep.eq({
  //     expected: true
  //   });
  // });

  // it('filled optional field (form rule not matching) is unexpected', () => {
  //   expect(fieldUtils.validateSync({
  //     fieldProps: Map({
  //       type: 'tel',
  //       value: 'abc',
  //       required: false
  //     }),
  //     fields,
  //     formRules
  //   })).to.deep.eq({
  //     expected: false,
  //     errorType: ['invalid']
  //   });
  // });

  // it('filled required field (form rule matching) is expected', () => {
  //   expect(fieldUtils.validateSync({
  //     fieldProps: Map({
  //       type: 'tel',
  //       value: '123',
  //       required: true
  //     }),
  //     fields,
  //     formRules
  //   })).to.deep.eq({
  //     expected: true
  //   });
  // });

  // it('optional filled field (form rule not matching) is unexpected', () => {
  //   expect(fieldUtils.validateSync({
  //     fieldProps: Map({
  //       name: 'username',
  //       value: 'foo',
  //       required: false
  //     }),
  //     fields,
  //     formRules
  //   })).to.deep.eq({
  //     expected: false,
  //     errorType: ['invalid']
  //   });
  // });

  // it('filled optional field (form rule matching) is expected', () => {
  //   expect(fieldUtils.validateSync({
  //     fieldProps: Map({
  //       name: 'username',
  //       value: 'admin',
  //       required: false
  //     }),
  //     fields,
  //     formRules
  //   })).to.deep.eq({
  //     expected: true
  //   });
  // });

  // it('filled required field (form rule matching) is expected', () => {
  //   expect(fieldUtils.validateSync({
  //     fieldProps: Map({
  //       name: 'username',
  //       value: 'admin',
  //       required: true
  //     }),
  //     fields,
  //     formRules
  //   })).to.deep.eq({
  //     expected: true
  //   });
  // });
});
