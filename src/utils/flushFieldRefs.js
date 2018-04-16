import dispatch from './dispatch';
import createPropGetter from './fieldUtils/createPropGetter';

/**
 * Returns the map of flushed field props paths referenced within the provided
 * method, and its initial value.
 * @param {Function} method
 * @param {CallbackHandlerArgs} methodArgs
 */
export default function flushFieldRefs(method, methodArgs) {
  const { fields, form } = methodArgs;
  const refs = [];
  const fieldPropGetter = createPropGetter(fields, propRefPath => refs.push(propRefPath));

  const initialValue = dispatch(method, {
    ...methodArgs,
    get: fieldPropGetter
  }, form.context);

  return { refs, initialValue };
}
