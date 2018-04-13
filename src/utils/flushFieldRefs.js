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
  const getFieldProp = createPropGetter(fields, propPath => refs.push(propPath));

  const initialValue = dispatch(method, {
    ...methodArgs,
    getFieldProp
  }, form.context);

  return { refs, initialValue };
}
