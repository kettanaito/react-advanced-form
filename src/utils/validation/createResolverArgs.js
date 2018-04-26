/**
 * Returns the unified interface of each validation rule resolver
 * based on the passed generic callback arguments.
 */
export default function createResolverArgs(args) {
  const { fieldProps } = args;
  const valuePropName = fieldProps.get('valuePropName');
  const value = fieldProps.get(valuePropName);

  return {
    ...args,
    [valuePropName]: value
  };
}
