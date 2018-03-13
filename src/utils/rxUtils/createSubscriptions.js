import ensafeMap from '../ensafeMap';
import makeObservable from '../makeObservable';

/**
 * @param {Map} fieldProps
 * @param {Map} fields
 * @param {ReactElement} form
 */
export default function createSubscriptions({ fieldProps, fields, form }) {
  const rxProps = fieldProps.get('reactiveProps');
  if (!rxProps) return;

  const subscriberFieldPath = fieldProps.get('fieldPath');
  const resolverArgs = { fieldProps, fields, form };

  rxProps.forEach((resolver, rxPropName) => {
    const { refs } = makeObservable(resolver, resolverArgs, {
      initialCall: true,
      async subscribe({ nextContextProps, shouldValidate = true }) {
        const refFieldPath = nextContextProps.get('fieldPath');
        const nextFields = form.state.fields.set(refFieldPath, nextContextProps);
        const safeFields = ensafeMap(nextFields, refs);

        const nextPropValue = resolver({
          fieldProps: fieldProps.toJS(),
          fields: safeFields.toJS(),
          form
        }, form.context);

        console.warn('Should update `%s` of `%s` to `%s', rxPropName, subscriberFieldPath.join('.'), nextPropValue);

        const { nextFieldProps: updatedFieldProps } = await form.updateField({
          fieldPath: subscriberFieldPath,
          propsPatch: { [rxPropName]: nextPropValue }
        });

        if (shouldValidate) {
          form.validateField({
            force: true,
            fieldPath: subscriberFieldPath,
            fieldProps: updatedFieldProps,
            forceProps: true,
            fields: nextFields
          });
        }
      }
    });
  });
}
