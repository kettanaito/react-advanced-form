// import type { Map } from 'immutable';
// import type { Component } from 'react';

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
export function getRulesBySelector(selector, fieldProps, schema) {
  const keyPath = [selector, fieldProps.get(selector)];

  //
  // TODO
  // Shallow keyed collection is not a usual behavior, but only suitable
  // for the reduced schema into "rxRules". Think of the unified interface.
  //
  const rules = schema.get(keyPath.join('.'));

  console.groupCollapsed('getRulesBySelector', selector, fieldProps.name);
  console.log({ keyPath });
  console.log({ rules });
  console.groupEnd();

  return rules;
}

/**
 * Returns the groupped collection of the validation rules
 * applicable to the given field.
 */
export default function getRules(fieldProps, schema) {
  return [
    'type',
    'name'
  ].reduce((rules, selector) => {
    const rulesGroup = getRulesBySelector(selector, fieldProps, schema);

    if (rulesGroup) {
      rules[selector] = rulesGroup
    }

    return rules;
  }, {});

  // return {
  //   type: getRulesBySelector(fieldProps, schema, 'type'),
  //   name: getRulesBySelector(fieldProps, schema, 'name'),
  // };
}
