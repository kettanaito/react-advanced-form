import makeObservable from './makeObservable';
import createPropGetter from '../fieldUtils/createPropGetter';

/**
 * @param {Record} fieldProps
 * @param {Map} fields
 * @param {ReactElement} form
 */
export default function createSubscriptions({ fieldProps, fields, form }) {
  const rxProps = fieldProps.get('reactiveProps');
  if (!rxProps) {
    return;
  }

  const subscriberFieldPath = fieldProps.fieldPath;
  const resolverArgs = { fieldProps, fields, form };

  rxProps.forEach((resolver, rxPropName) => {
    makeObservable(resolver, resolverArgs, {
      initialCall: true,
      subscribe({ nextContextProps, shouldValidate = true }) {
        const refFieldPath = nextContextProps.fieldPath;
        const nextFields = form.state.fields.set(refFieldPath, nextContextProps);

        const nextPropValue = resolver({
          fieldProps: fieldProps.toJS(),
          fields: nextFields.toJS(),
          get: createPropGetter(nextFields),
          form
        }, form.context);

        // console.warn('Should update `%s` of `%s` to `%s', rxPropName, subscriberFieldPath.join('.'), nextPropValue);

        const fieldUpdated = form.updateField({
          fieldPath: subscriberFieldPath,
          update: fieldProps => fieldProps.set(rxPropName, nextPropValue)
        });

        if (shouldValidate) {
          fieldUpdated.then(({ nextFieldProps: updatedFieldProps }) => {
            form.validateField({
              force: true,
              fieldPath: subscriberFieldPath,
              fieldProps: updatedFieldProps,
              forceProps: true,
              fields: nextFields
            });
          });
        }
      }
    });
  });
}
