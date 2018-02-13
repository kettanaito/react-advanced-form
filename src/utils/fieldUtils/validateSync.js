/**
 * Synchronous validation of the provided field.
 */
import { commonErrorTypes, createRejectedRule, composeResult } from './validate';
import dispatch from '../dispatch';

function applyRule({ rule, name = 'invalid', selector, resolverArgs }) {
  const { form } = resolverArgs;
  const isExpected = dispatch(rule, resolverArgs, form.context);
  if (isExpected) return;

  return createRejectedRule({
    name,
    selector,
    isCustom: !Object.keys(commonErrorTypes).includes(name)
  });
}

function applyRules({ selector, rules, resolverArgs }) {
  if (typeof rules === 'function') {
    const error = applyRule({ rule: rules, selector, resolverArgs });
    return error ? [error] : [];
  }

  return rules.reduce((rejectedRules, rule, name) => {
    const error = applyRule({ rule, name, selector, resolverArgs });
    return error ? rejectedRules.concat(error) : rejectedRules;
  }, []);
}

function applyRulesSchema(rules, resolverArgs) {
  const { fieldProps } = resolverArgs;

  const nameRules = rules.getIn(['name', fieldProps.get('name')]);
  const typeRules = rules.getIn(['type', fieldProps.get('type')]);

  if (!nameRules && !typeRules) return [];

  if (nameRules) {
    const rejectedRules = applyRules({
      selector: 'name',
      rules: nameRules,
      resolverArgs
    });

    if (rejectedRules.length > 0) return rejectedRules;
  }

  if (typeRules) {
    const rejectedRules = applyRules({
      selector: 'type',
      rules: typeRules,
      resolverArgs
    });

    return rejectedRules;
  }

  return [];
}

export default function validateSync({ fieldProps, fields, form, formRules }) {
  /* Bypass validation for already valid field */
  if (fieldProps.get('validSync')) {
    return composeResult(true);
  }

  /* Get properties shorthand references */
  const name = fieldProps.get('name');
  const type = fieldProps.get('type');
  const valuePropName = fieldProps.get('valuePropName');
  const value = fieldProps.get(valuePropName);
  const required = fieldProps.get('required');
  const rule = fieldProps.get('rule');
  const asyncRule = fieldProps.get('asyncRule');

  /* Empty optional fields are expected */
  if (!value && !required) {
    return composeResult(true);
  }

  /* Empty required fields are unexpected */
  if (!value && required) {
    return composeResult(false, createRejectedRule({
      name: commonErrorTypes.missing
    }));
  }

  /* Assume Field doesn't have any relevant validation rules */
  const hasFormNameRules = formRules.hasIn(['name', name]);
  const hasFormTypeRules = formRules.hasIn(['type', type]);
  const hasFormRules = hasFormNameRules || hasFormTypeRules;

  if (!rule && !asyncRule && !hasFormRules) {
    return composeResult(true);
  }

  if (rule) {
    const isExpected = (typeof rule === 'function')
      ? dispatch(rule, {
        value,
        fieldProps,
        fields,
        form
      }, form.context)
      : rule.test(value);

    if (!isExpected) {
      return composeResult(false, createRejectedRule({
        name: commonErrorTypes.invalid
      }));
    }
  }

  /**
   * Form-level validation.
   * A form-wide validation provided by "rules" property of the Form.
   * The latter property is also inherited from the context passed by FormProvider.
   */
  const rejectedRules = applyRulesSchema(formRules, {
    value,
    fieldProps,
    fields,
    form
  });

  if (rejectedRules.length > 0) {
    return composeResult(false, rejectedRules);
  }

  return composeResult(true);
}
