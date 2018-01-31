/**
 * Synchronously validate the provided field.
 */
import { List } from 'immutable';
import { commonErrorTypes, customRulesKey, composeResult } from './validate';

function createRejectedRule({ name = null, selector = null, isCustom = false }) {
  return { name, selector, isCustom };
}

function applyRule({ rule, name = 'invalid', selector, resolverArgs }) {
  const isExpected = rule(resolverArgs);
  if (isExpected) return;

  return createRejectedRule({
    name,
    selector,
    isCustom: !Object.keys(commonErrorTypes).includes(name)
  });
}

function applyRules({ selector, rules, resolverArgs }) {
  const { fieldProps } = resolverArgs;

  if (typeof rules === 'function') {
    const error = applyRule({ rule: rules, selector, resolverArgs });
    return error ? [error] : [];
  }

  console.log(' ');
  console.log('applyRules', selector, rules, fieldProps, resolverArgs);
  console.log('top-scope rules:', rules && rules.toJS());
  console.log('selector:', selector);

  return rules.reduce((rejectedRules, rule, name) => {
    const error = applyRule({ rule, name, selector, resolverArgs });
    return error ? rejectedRules.concat(error) : rejectedRules;
  }, []);
}

function applyRulesSchema(rules, resolverArgs) {
  const { fieldProps } = resolverArgs;

  const nameRules = rules.getIn(['name', fieldProps.name]);
  if (nameRules) {
    const rejectedRules = applyRules({
      selector: 'name',
      rules: nameRules,
      resolverArgs
    });

    console.log('rejected name-specific rules:', rejectedRules);

    if (rejectedRules.length > 0) return rejectedRules;
  }

  const typeRules = rules.getIn(['type', fieldProps.type]);
  const rejectedRules = applyRules({
    selector: 'type',
    rules: typeRules,
    resolverArgs
  });

  console.log('rejected type-specific rules:', rejectedRules);
  return rejectedRules;
}

export default function validateSync({ fieldProps, fields, form, formRules }) {
  /* Bypass validation for already valid field */
  if (fieldProps.get('validSync')) {
    return composeResult(true);
  }

  /* Get properties shorthand references */
  const name = fieldProps.get('name');
  const type = fieldProps.get('type');
  const value = fieldProps.get('value');
  const required = fieldProps.get('required');
  const rule = fieldProps.get('rule');
  const asyncRule = fieldProps.get('asyncRule');

  /* Empty optional fields are expected */
  if (!value && !required) {
    return composeResult(true);
  }

  /* Empty required fields are unexpected */
  if (!value && required) {
    return composeResult(false, List([createRejectedRule({
      name: commonErrorTypes.missing,
      path: [commonErrorTypes.missing]
    })]));
  }

  /* Assume Field doesn't have any relevant validation rules */
  const hasFormNameRules = formRules.hasIn(['name', name]);
  const hasFormTypeRules = formRules.hasIn(['type', type]);
  const hasFormRules = hasFormNameRules || hasFormTypeRules;

  if (!rule && !asyncRule && !hasFormRules) {
    return composeResult(true);
  }

  /* Format validation */
  const mutableFieldProps = fieldProps.toJS();

  if (rule) {
    const isExpected = (typeof rule === 'function')
      ? rule({
        value,
        fieldProps: mutableFieldProps,
        fields: fields.toJS(),
        form
      })
      : rule.test(value);

    if (!isExpected) {
      return composeResult(false, List([createRejectedRule({
        name: commonErrorTypes.invalid,
        path: [commonErrorTypes.invalid]
      })]));
    }
  }

  /**
   * Form-level validation.
   * A form-wide validation provided by "rules" property of the Form.
   * The latter property is also inherited from the context passed by FormProvider.
   */
  const rejectedRules = applyRulesSchema(formRules, {
    value,
    fieldProps: mutableFieldProps,
    fields: fields.toJS(),
    form
  });

  console.warn('rejectedRules:', rejectedRules);

  if (rejectedRules.length > 0) {
    return composeResult(false, rejectedRules);
  }

  return composeResult(true);
}
