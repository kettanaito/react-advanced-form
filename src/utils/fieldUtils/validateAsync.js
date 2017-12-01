export default async function validateAsync({ fieldProps, fields, formProps }) {
  const value = fieldProps.get('value');
  const asyncRule = fieldProps.get('asyncRule');

  if (!asyncRule) return { expected: true };

  let expected = false;
  let extra = {};
  const res = await asyncRule({ value, fieldProps: fieldProps.toJS(), fields: fields.toJS(), formProps });

  if (res) {
    const { valid, ...rest } = res;
    expected = valid;
    extra = rest;
  }

  return {
    expected,
    errorType: 'async',
    extra
  };
}
