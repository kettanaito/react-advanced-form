// import type { Map } from 'immutable';
// import type { Component } from 'react';

// export type TRuleResolverArgs = {
//   value: mixed,
//   fieldProps: Map<string, string>,
//   fields: Component<any, any, any>,
//   form: mixed
// };

// export type TRule = (args: TRuleResolverArgs) => boolean;

// export type TFieldRules = {
//   type?: TRule[],
//   name?: TRule[],
// };

// export type TRuleSchema = {
//   type?: { [fieldType: string]: TRule },
//   name?: { [fieldName: string]: TRule }
// }

/**
 * Returns the collection of validation rules of the given selector
 * applicabale to the given field.
 */
export function getRulesGroup(fieldProps, schema, selector) {
  return schema.getIn([selector, fieldProps.get(selector)]);
}

/**
 * Returns the groupped collection of the validation rules
 * applicable to the given field.
 */
export default function getRules(fieldProps, schema) {
  return {
    type: getRulesGroup(fieldProps, schema, 'type'),
    name: getRulesGroup(fieldProps, schema, 'name'),
  };
}
