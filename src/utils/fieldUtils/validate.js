import { Map } from 'immutable';
import validateSync from './validateSync';
import validateAsync from './validateAsync';
import Sequence from '../../classes/Sequence';
import { validationTypes } from '../../classes/ValidationType';

export const commonErrorTypes = {
  missing: 'missing',
  invalid: 'invalid',
  async: 'async'
};

/**
 * A key which groups the messages of the named validation rules.
 * Example: "messages.name.fieldName.rules.someCutomRule".
 */
export const customRulesKey = 'rule';

/**
 * Returns a unified validation result interface based on the received arguments.
 * @param {Boolean} expected
 * @param {List<[string]>} rejectedRules
 * @return {Map}
 */
export const composeResult = (expected, rejectedRules = [], extra) => Map({
  propsPatch: Map({ expected }),
  rejectedRules: Array.isArray(rejectedRules) ? rejectedRules : [rejectedRules],
  extra
});

/**
 * Returns a unified interface of the rejected rule.
 * @param {string} name The name of the rejected rule.
 * @param {string} selector The rule's selector ("type", "name", or null)
 * @param {boolean} isCustom States the rule as custom (named rule).
 * @return {Object}
 */
export function createRejectedRule({ name = null, selector = null, isCustom = false }) {
  return { name, selector, isCustom };
}

/**
 * @param {Map} acc
 * @param {IteratorEntry} entry
 * @param {Map} resolved
 * @param {Boolean} isLast
 * @param {Function} stop
 */
const sequenceIterator = ({ acc, variables, resolved, isLast, breakIteration }) => {
  const expected = resolved.getIn(['propsPatch', 'expected']);

  /* Prevent any following validation once the previous one fails */
  if (!isLast && !expected) breakIteration();

  /* Get the name of the sequence entry (which is the validation type) */
  const { validationType } = variables;

  const nextAcc = acc
    .merge(resolved)
    .setIn(['propsPatch', `validated${validationType}`], true)
    .setIn(['propsPatch', `valid${validationType}`], expected);

  return nextAcc;
};

/**
 * Determines whether the given Field is valid.
 * Validation of each field is a complex process consisting of several steps.
 * It is important to resolve the validation immediately once the field becomes invalid.
 * @param {Map} fieldProps
 * @param {Map} fields
 * @param {object} form
 * @param {Map} formRules
 * @return {boolean}
 */
export default async function validate({ type, fieldProps, fields, form }) {
  // console.groupCollapsed(`fieldUtils @ validate "${fieldProps.get('fieldPath')}"`);
  // console.log('type', type);
  // console.log('fieldProps', Object.assign({}, fieldProps.toJS()));
  // console.log('fields', fields);
  // console.log('form', form);
  // console.log('formRules', formRules.toJS());
  // console.groupEnd();

  /* Create a new validation sequence */
  const validationSeq = new Sequence({
    initialValue: Map(),
    iterator: sequenceIterator
  });

  /* Sync validation */
  if (type.isBoth || type.isSync) {
    validationSeq.add({
      variables: {
        validationType: validationTypes.sync
      },
      resolver: () => validateSync({ fieldProps, fields, form })
    });
  }

  /* Async validation */
  if (type.isBoth || type.isAsync) {
    validationSeq.add({
      variables: {
        validationType: validationTypes.async
      },
      resolver: () => validateAsync({ fieldProps, fields, form })
    });
  }

  /* Return the accumulated result (propsPatch) of the validation */
  return validationSeq.run();
}
