// import type { TSeq } from '../creators';
// import type { TValidatorFunc, TValidationResult } from '.';
// import type { TValidatorArgs } from './getRules';

import { seq } from '.';
import errorTypes from './errorTypes';
import createResolverArgs from './createResolverArgs';
import createRejectedRule from './createRejectedRule';
import createValidationResult from './createValidationResult';
import getRules from './getRules';
import dispatch from '../dispatch';
import fieldUtils from '../fieldUtils';

/**
 * Applies the validator provided by "Field.props.rule".
 */
function applyFieldRule(resolverArgs) {
  const { fieldProps, form } = resolverArgs;
  const value = fieldUtils.__foo__.getValue(fieldProps);
  const rule = fieldProps.get('rule');

  const expected = (typeof rule === 'function')
    ? dispatch(rule, resolverArgs, form.context)
    : rule.test(value);

  const rejectedRules = expected ? [] : createRejectedRule({
    name: errorTypes.invalid
  });

  return createValidationResult(expected, rejectedRules);
}

/**
 * Sequentially applies validation rules from the schema
 * relevent to the given field.
 */
function applyFormRules(resolverArgs) {
  const { fieldProps } = resolverArgs;

  const rules = getRules(fieldProps);
  console.log({ rules });

  return seq(
    rules.name,
    rules.type
  );
}

/**
 * Performs synchronous validation.
 */
export default function validateSync(args) {
  const { fieldProps, form } = args;
  const { rxRules } = form.state;
  const fieldName = fieldProps.get('name');
  const fieldType = fieldProps.get('type');
  const value = fieldUtils.__foo__.getValue(fieldProps);
  const required = fieldProps.get('required');
  const rule = fieldProps.get('rule');
  const asyncRule = fieldProps.get('asyncRule');

  console.log(' ');
  console.log('validateSync:', fieldName, fieldType);

  // Add bypassing logic
  if (!value && !required) {
    console.log('optional empty field, bypassing...')
    return createValidationResult(true);
  }

  if (!value && required) {
    console.log('empty required field, throwing...')
    return createValidationResult(false, createRejectedRule({
      name: errorTypes.missing
    }));
  }

  const hasFormNameRules = rxRules.has(`name.${fieldName}`);
  const hasFormTypeRules = rxRules.has(`type.${fieldType}`);
  const hasFormRules = hasFormNameRules || hasFormTypeRules;

  if (!rule && !asyncRule && !hasFormRules) {
    console.log('no rules for a field, bypassing...')
    // And this will return just one Object. :/
    return createValidationResult(true);
  }

  const executeValidationSeq = seq(
    applyFieldRule,
    applyFormRules
  );

  const resolverArgs = createResolverArgs(args);

  // This will return array of Objects
  return executeValidationSeq(resolverArgs);
}
