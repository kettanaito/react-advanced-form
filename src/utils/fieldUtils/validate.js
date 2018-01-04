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
import { Map } from 'immutable';
import validateSync from './validateSync';
import validateAsync from './validateAsync';
import Sequence from '../../Sequence';

const sequenceIterator = ({ acc, entry, resolved, isLast, stop }) => {
  const { expected } = resolved;
  /* Prevent any following validation once the previous one fails */
  if (!isLast && !expected) stop();

  /* Update dynamic properties based on the current validation entry */
  acc[`validated${entry.name}`] = true;
  acc[`valid${entry.name}`] = resolved.expected;
  acc.expected = resolved.expected;

  return { ...acc, ...resolved };
};

export default async function validate({ type, fieldProps, fields, form, formRules = Map() }) {
  console.groupCollapsed('fieldUtils @ validate', fieldProps.get('fieldPath'));
  console.log('type', type);
  console.log('fieldProps', Object.assign({}, fieldProps.toJS()));
  console.log('fields', fields);
  console.log('form', form);
  console.log('formRules', formRules.toJS());
  console.groupEnd();

  /* Create a new validation sequence */
  const validationSeq = new Sequence({ iterator: sequenceIterator });

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

  /* Return the accumulated result (patchProps) of the validation */
  return validationSeq.run();
}
