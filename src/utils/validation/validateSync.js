// import type { TSeq } from '../creators';
// import type { TValidatorFunc, TValidationResult } from '.';
// import type { TValidatorArgs } from './getRules';

import { seq } from '.';
import errorTypes from './errorTypes';
import createResolverArgs from './createResolverArgs';
import createRejectedRule from './createRejectedRule';
import createValidationResult from './createValidationResult';
import reduceValidationResults from './reduceValidationResults';
import getRules from './getRules';
import dispatch from '../dispatch';
import * as recordUtils from '../recordUtils';

/**
 * Applies the validator provided by "Field.props.rule".
 */
function applyFieldRule(resolverArgs) {
  console.log('applying Field.props.rule...');

  const { fieldProps, form } = resolverArgs;
  const { rule } = fieldProps;
  const value = recordUtils.getValue(fieldProps);

  console.log({ value })

  const expected = (typeof rule === 'function')
    ? dispatch(rule, resolverArgs, form.context)
    : rule.test(value);

  const rejectedRules = expected ? undefined : createRejectedRule({
    name: errorTypes.invalid
  });

  console.log({ expected })
  console.log({ rejectedRules })
  console.log(' ')

  return createValidationResult(expected, rejectedRules);
}

/**
 * Sequentially applies validation rules from the schema
 * relevent to the given field.
 */
function applyFormRules(resolverArgs) {
  console.log('Applying form rules...');

  const { fieldProps, form } = resolverArgs;
  const { rxRules: schema } = form.state;

  const rules = getRules(fieldProps, schema);
  console.log({ rules });

  const validationSeq = reduceValidationResults(
    seq(
      rules.name,
      rules.type
    )
  );

  return validationSeq(resolverArgs);
}

/**
 * Performs synchronous validation.
 */
export default function validateSync(args) {
  const { fieldProps, form } = args;
  const { rxRules } = form.state;
  const {
    name: fieldName,
    type: fieldType,
    required,
    rule,
    asyncRule
  } = fieldProps;

  const value = recordUtils.getValue(fieldProps);

  console.log(' ');
  console.log('validateSync:', fieldName, fieldType);

  /* Treat empty optional fields as expected */
  if (!value && !required) {
    console.log('optional empty field, bypassing...')
    return createValidationResult(true);
  }

  /* Treat empty required fields as unexpected */
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
    return createValidationResult(true);
  }

  console.log('validateSync seq...')

  const resolverArgs = createResolverArgs(args);
  console.log({ resolverArgs })

  /* Apply the list of validators in a breakable sequence and reduce their results */
  const validationSeq = reduceValidationResults(
    seq(
      applyFieldRule,
      // applyFormRules
    )
  );

  const res = validationSeq(resolverArgs);
  console.log('validateSync seq res:', res)

  return res;
}
