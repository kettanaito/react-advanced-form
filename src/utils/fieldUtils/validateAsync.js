export default async function validateAsync({ fieldProps, fields, formProps }) {
  const { value, asyncRule } = fieldProps;
  if (!asyncRule) return { expected: true };

  const res = await asyncRule({ value, fieldProps, fields, formProps });

  return {
    expected: res.ok,
    errorType: 'async',
    extra: {
      res,
      payload: await res.json()
    }
  };

  return { expected: isExpected };
}