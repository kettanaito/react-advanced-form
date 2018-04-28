// import type { TSeq } from '../creators';
// import type { TValidatorFunc, TValidationResult } from '.';
// import type { TValidatorArgs } from './getRules';

import { seq } from '.';
import errorTypes from './errorTypes';
import createResolverArgs from './createResolverArgs';
import createRejectedRule from './createRejectedRule';
import createValidationResult from './createValidationResult';
import mapToSingleResult from './mapToSingleResult';
import getRules from './getRules';
import dispatch from '../dispatch';
import * as recordUtils from '../recordUtils';

/**
 * Applies the given resolver function and returns
 * the validation result.
 */
function applyResolver(resolver, resolverArgs) {
  const expected = dispatch(resolver, resolverArgs, resolverArgs.form.context);
  return createValidationResult(expected);
}

function mapRulesToResolvers(rules) {
  return rules.map(({ resolver }) => {
    return resolverArgs => applyResolver(resolver, resolverArgs);
  });
}

/**
 * Applies the validator provided by "Field.props.rule".
 */
function applyFieldRule(resolverArgs) {
  console.warn('applyFieldRule...');

  const { value, fieldProps, form } = resolverArgs;
  const { rule } = fieldProps;

  if (!rule) {
    console.log('field has no "rule", bypassing...');
    return createValidationResult(true);
  }

  console.log({ value })

  const expected = (typeof rule === 'function')
    ? applyResolver(rule, resolverArgs) // this will return ValidationResult
    : rule.test(value); // while this will return boolean

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
 * relevant to the given field.
 */
function applyFormRules(resolverArgs) {
  console.log(' ');
  console.warn('applyFormRules...');

  const { fieldProps, form } = resolverArgs;
  const { rxRules: schema } = form.state;
  console.log('schema', schema && schema.toJS());

  const rules = getRules(fieldProps, schema);
  const hasNameRules = rules.name && (rules.name.length > 0);
  const hasTypeRules = rules.type && (rules.type.length > 0);
  console.log({ rules });

  //
  // TODO
  // Perform this exclusion better
  //
  if (!hasNameRules && !hasTypeRules) {
    return createValidationResult(true);
  }

  return mapToSingleResult(
    seq(
      mapToSingleResult(...mapRulesToResolvers(rules.name)),
      mapToSingleResult(...mapRulesToResolvers(rules.type)),
    )
  )(resolverArgs);
}

/**
 * Performs synchronous validation.
 */
export default function validateSync(args) {
  const resolverArgs = createResolverArgs(args);
  const { value, fieldProps, form } = resolverArgs;
  const { rxRules } = form.state;
  const { required } = fieldProps;

  console.log(' ');
  console.log('validateSync:', fieldProps.name, fieldProps.type);

  //
  // TODO
  // See if this bypassing logic can be implemented using functional approach.
  //

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

  console.log('validateSync seq...')
  console.log({ resolverArgs })

  /* Apply the list of validators in a breakable sequence and reduce the results to the single one */
  return mapToSingleResult(
    seq(
      applyFieldRule,
      applyFormRules
    )
  )(resolverArgs);
}
