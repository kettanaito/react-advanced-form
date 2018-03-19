/**
 * Applies the provided enhancers to the field.
 * @param {Enhancer[]} enhancers
 */
import invariant from 'invariant';
import { getComponentName } from './utils';

export default function applyEnhancers(...enhancers) {
  return (Field) => {
    invariant(enhancers && enhancers.length > 0, 'Cannot apply enhancers to the `%s` field. Expected the list ' +
      'of enhancers separated by comma, but got none.', getComponentName(Field));

    enhancers.forEach((AppliedEnhancer) => {
      new AppliedEnhancer(Field);
    });

    return Field;
  };
}
