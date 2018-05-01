// import type { TSeq } from '../creators';
// import type { TValidatorFunc, TValidationResult } from '.';
// import type { TValidatorArgs } from './getRules';

import { seq } from '../';
import dispatch from '../../dispatch';
import errorTypes from '../errorTypes';
import createResolverArgs from '../createResolverArgs';
import createRejectedRule from '../createRejectedRule';
import createValidationResult from '../createValidationResult';
import mapToSingleResult from '../mapToSingleResult';
import getRules from '../getRules';

/**
 * Applies the given resolver function and returns
 * the validation result.
 */
function applyResolver(resolver, resolverArgs) {
  return dispatch(resolver, resolverArgs, resolverArgs.form.context);
}

function applyRule(rule, resolverArgs) {
  const { name, selector, resolver } = rule;
  const expected = applyResolver(resolver, resolverArgs);
  const rejectedRules = expected ? undefined : createRejectedRule({
    name: name || errorTypes.invalid,
    selector,
    isCustom: !!name
  });

  return createValidationResult(expected, rejectedRules);
}

function mapRulesToResolvers(rules) {
  return rules.map((rule) => {
    return resolverArgs => applyRule(rule, resolverArgs);
  });
}

/**
 * Applies the validator provided by "Field.props.rule".
 */
function applyFieldRule(resolverArgs) {
  console.groupCollapsed('applyFieldRule...');

  const { value, fieldProps } = resolverArgs;
  const { rule } = fieldProps;

  console.log({ value })
  console.log({ rule });

  if (!rule) {
    console.log('has no rule, bypassing...');
    console.groupEnd();
    return createValidationResult(true);
  }

  const expected = (typeof rule === 'function')
    ? applyResolver(rule, resolverArgs)
    : rule.test(value);

  const rejectedRules = expected ? undefined : createRejectedRule({
    name: errorTypes.invalid
  });

  console.log({ expected })
  console.log({ rejectedRules })
  console.groupEnd();

  return createValidationResult(expected, rejectedRules);
}

/**
 * Takes the rules from the schema relative to the given field
 * and applies them in a breakable sequence, retuning the
 * validation result.
 */
function applyFormRules(resolverArgs) {
  console.groupCollapsed('applyFormRules...');

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
    console.log('has no relevant rules, bypassing...');
    console.groupEnd();
    return createValidationResult(true);
  }

  const res = mapToSingleResult(
    seq(
      mapToSingleResult(...mapRulesToResolvers(rules.name)),
      mapToSingleResult(...mapRulesToResolvers(rules.type)),
    )
  )(resolverArgs);

  console.log({ res });
  console.groupEnd();

  return res;
}

/**
 * Performs synchronous validation.
 */
export default function validateSync(args) {
  const resolverArgs = createResolverArgs(args);
  const { value, fieldProps } = resolverArgs;
  const { required } = fieldProps;

  console.groupCollapsed('validateSync:', fieldProps.name, fieldProps.type);

  //
  // TODO
  // See if this bypassing logic can be implemented using functional approach.
  //

  /* Treat empty optional fields as expected */
  if (!value && !required) {
    console.log('optional empty field, bypassing...');
    console.groupEnd();

    return createValidationResult(true);
  }

  /* Treat empty required fields as unexpected */
  if (!value && required) {
    console.log('required empty field, unexpected!');
    console.groupEnd();

    return createValidationResult(false, createRejectedRule({
      name: errorTypes.missing
    }));
  }

  console.log('continue with validators sequence...');
  console.log({ resolverArgs });
  console.groupEnd();

  /* Apply the list of validators in a breakable sequence and reduce the results to the single one */
  return mapToSingleResult(
    seq(
      applyFieldRule,
      applyFormRules
    )
  )(resolverArgs);
}
