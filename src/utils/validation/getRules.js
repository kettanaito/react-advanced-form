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
export function getRulesGroup(fieldProps, schema, selector) {
  return schema.getIn([selector, fieldProps.get(selector)]);
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
    const rulesGroup = getRulesGroup(fieldProps, schema, selector);

    if (rulesGroup) {
      rules[selector] = rulesGroup
    }

    return rules;
  }, {});

  // return {
  //   type: getRulesGroup(fieldProps, schema, 'type'),
  //   name: getRulesGroup(fieldProps, schema, 'name'),
  // };
}
