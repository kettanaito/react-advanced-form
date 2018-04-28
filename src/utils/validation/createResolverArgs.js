// import type { Map } from 'immutable';
// import type { Component } from 'react';

// type TOriginalArgs = {
//   fieldProps: Map<string, string>,
//   fields: Component<any, any, any>,
//   form: mixed
// };

// export type TRuleResolverArgs = TOriginalArgs & {
//   [valuePropName: string]: mixed
// };

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
