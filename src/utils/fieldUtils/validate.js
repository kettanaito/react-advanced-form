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
import { List, Map } from 'immutable';
import validateSync from './validateSync';
import validateAsync from './validateAsync';
import Sequence from '../../classes/Sequence';

/**
* Shorthand function to return a unified validation result Object.
*/
export const composeResult = (expected, errorPaths = List()) => (Map({
 propsPatch: Map({
   expected
 }),
 errorPaths
}));

const sequenceIterator = ({ acc, entry, resolved, isLast, stop }) => {
  const resolvedPropsPatch = resolved.get('propsPatch');
  const expected = resolvedPropsPatch.get('expected');

  /* Prevent any following validation once the previous one fails */
  if (!isLast && !expected) stop();

  /* Get the name of the sequence entry (which is the validation type) */
  const { name: validationType } = entry;

  const nextPropsPatch = resolvedPropsPatch
    .set(`validated${validationType}`, true)
    .set(`valid${validationType}`, expected);

  const nextAcc = acc
    .merge(resolved)
    .set('propsPatch', nextPropsPatch);

  return nextAcc;
};

export default async function validate({ type, fieldProps, fields, form, formRules = Map() }) {
  console.groupCollapsed(`fieldUtils @ validate "${fieldProps.get('fieldPath')}"`);
  console.log('type', type);
  console.log('fieldProps', Object.assign({}, fieldProps.toJS()));
  console.log('fields', fields);
  console.log('form', form);
  console.log('formRules', formRules.toJS());
  console.groupEnd();

  /* Create a new validation sequence */
  const validationSeq = new Sequence({
    initialValue: Map(),
    iterator: sequenceIterator
  });

  /* Sync validation */
  if (type.isBoth || type.isSync) {
    validationSeq.add({
      name: 'Sync',
      resolver: () => validateSync({ fieldProps, fields, form, formRules })
    });
  }

  /* Async validation */
  if (type.isBoth || type.isAsync) {
    validationSeq.add({
      name: 'Async',
      resolver: () => validateAsync({ fieldProps, fields, form, formRules })
    });
  }

  /* Return the accumulated result (propsPatch) of the validation */
  return validationSeq.run();
}
