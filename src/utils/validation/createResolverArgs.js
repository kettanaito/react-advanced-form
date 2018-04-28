// import type { Map } from 'immutable';
// import type { Component } from 'react';
import createPropGetter from '../fieldUtils/createPropGetter';

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
 * arguments Object based on the passed arguments.
 */
export default function createResolverArgs(args) {
  const { fieldProps, fields } = args;
  const valuePropName = fieldProps.get('valuePropName');
  const value = fieldProps.get(valuePropName);

  return {
    ...args,
    [valuePropName]: value,
    get: createPropGetter(fields)
  };
}
