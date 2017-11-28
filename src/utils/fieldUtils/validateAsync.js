export default async function validateAsync({ fieldProps, fields, formProps }) {
  const { value, asyncRule } = fieldProps;
  if (!asyncRule) return { expected: true };

  const res = await asyncRule({ value, fieldProps, fields, formProps });
  const { valid, ...rest } = res;

  return {
    expected: valid,
    errorType: 'async',
    extra: {
      ...rest
    }
  };
}
