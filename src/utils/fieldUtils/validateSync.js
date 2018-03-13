/**
 * Synchronous validation of the provided field.
 */
import { commonErrorTypes, createRejectedRule, composeResult } from './validate';
import ensafeMap from '../ensafeMap';
import dispatch from '../dispatch';

function applyRule({ rule, name = 'invalid', selector, resolverArgs, refs }) {
  const { fields } = resolverArgs;
  const safeFields = refs ? ensafeMap(fields, refs) : fields;

  /* Enfore mutability of args for fields proxying */
  const isExpected = dispatch(rule, { ...resolverArgs, fields: safeFields }, { withImmutable: false });
  if (isExpected) return;

  return createRejectedRule({
    name,
    selector,
    isCustom: !Object.keys(commonErrorTypes).includes(name)
  });
}

function applyRules({ selector, rules, resolverArgs, refs }) {
  if (typeof rules === 'function') {
    const error = applyRule({ rule: rules, selector, resolverArgs, refs });
    return error ? [error] : [];
  }

  return rules.reduce((rejectedRules, rule, name) => {
    const error = applyRule({ rule, name, selector, resolverArgs, refs });
    return error ? rejectedRules.concat(error) : rejectedRules;
  }, []);
}

/**
 * Applies the provided rules schema.
 * @param {Map} schema
 * @param {Object} resolverArgs
 * @returns {String[]}
 */
function applyRulesSchema(schema, resolverArgs) {
  const { fieldProps, form } = resolverArgs;

  const nameKeyPath = ['name', fieldProps.get('name')];
  const nameRules = schema.getIn(nameKeyPath);
  const typeKeyPath = ['type', fieldProps.get('type')];
  const typeRules = schema.getIn(typeKeyPath);

  if (!nameRules && !typeRules) return [];

  if (nameRules) {
    const rejectedRules = applyRules({
      selector: 'name',
      rules: nameRules,
      resolverArgs,
      refs: form.state.rxRules.getIn(nameKeyPath)
    });

    if (rejectedRules.length > 0) {
      return rejectedRules;
    }
  }

  if (typeRules) {
    const rejectedRules = applyRules({
      selector: 'type',
      rules: typeRules,
      resolverArgs,
      refs: form.state.rxRules.getIn(typeKeyPath)
    });

    return rejectedRules;
  }

  return [];
}

export default function validateSync({ fieldProps, fields, form, formRules }) {
  /* Bypass validation for already valid field */
  // if (fieldProps.get('validSync')) {
  //   console.log('already valid, bypassing...');
  //   return composeResult(true);
  // }

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
      /* Enfore mutability of args for fields proxying */
      ? dispatch(rule, {
        value,
        fieldProps,
        fields,
        form
      }, { withImmutable: false })
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
