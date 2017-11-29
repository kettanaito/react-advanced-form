export default async function validateAsync({ fieldProps, fields, formProps }) {
  const value = fieldProps.get('value');
  const asyncRule = fieldProps.get('asyncRule');

  if (!asyncRule) return { expected: true };

  const res = await asyncRule({ value, fieldProps: fieldProps.toJS(), fields, formProps });
  const { valid, ...rest } = res;

  return {
    expected: valid,
    errorType: 'async',
    extra: {
      ...rest
    }
  };
}
