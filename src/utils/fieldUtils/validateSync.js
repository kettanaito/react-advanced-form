import createPropGetter from './createPropGetter';
import { commonErrorTypes, createRejectedRule, composeResult } from './validate';
import { ruleSelectors } from '../formUtils/getFieldRules';
import dispatch from '../dispatch';

/**
 * Returns the list of rejected rules based on the provided arguments.
 * The function accesses the "rxRules" of the form automatically, therefore doesn't expect any
 * validation rules passed explicitly.
 * @param {any} value
 * @param {Map} fieldProps
 * @param {Map} fields
 * @param {ReactComponent} form
 * @returns {Array<RejectedRule>}
 */
function getRejectedRules(resolverArgs) {
  const rejectedRules = [];
  const { fieldProps, form } = resolverArgs;

  /* Iterating through each rule selector ("name" and "type") */
  ruleSelectors.forEach((ruleSelector) => {
    if (rejectedRules.length > 0) {
      return;
    }

    const ruleKeyPath = ruleSelector(fieldProps);
    const rules = form.state.rxRules.get(ruleKeyPath.join('.'));
    if (!rules) {
      return;
    }

    rules.forEach((rule) => {
      const { name, selector, resolver } = rule;
      const isExpected = dispatch(resolver, resolverArgs, form.context);

      if (isExpected) {
        return;
      }

      const errorName = name || commonErrorTypes.invalid;

      const rejectedRule = createRejectedRule({
        name: errorName,
        selector,
        isCustom: !Object.keys(commonErrorTypes).includes(errorName)
      });

      rejectedRules.push(rejectedRule);
    });
  });

  return rejectedRules;
}

/**
 * Performs a synchronous validation of the provided field.
 * @param {Map} fieldProps
 * @param {Map} fields
 * @param {Object} form
 * @returns {ValidationResult}
 */
export default function validateSync({ fieldProps, fields, form }) {
  const { rxRules } = form.state;
  const fieldName = fieldProps.get('name');
  const fieldType = fieldProps.get('type');
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
  const hasFormNameRules = rxRules.has(`name.${fieldName}`);
  const hasFormTypeRules = rxRules.has(`type.${fieldType}`);
  const hasFormRules = hasFormNameRules || hasFormTypeRules;

  if (!rule && !asyncRule && !hasFormRules) {
    return composeResult(true);
  }

  const resolverArgs = {
    [valuePropName]: value,
    fieldProps,
    get: createPropGetter(fields),
    fields,
    form
  };

  //
  // Create a chainable interface for these granular validator functions
  // seq(vali).then(sfog);
  // Or dive even deeper, and chain validators on the type/name rules level,
  // because there is the exact sequencing and cancellation of rules.
  //

  if (rule) {
    const isExpected = (typeof rule === 'function')
      ? dispatch(rule, resolverArgs, form.context)
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
  const rejectedRules = getRejectedRules(resolverArgs);

  if (rejectedRules.length > 0) {
    return composeResult(false, rejectedRules);
  }

  return composeResult(true);
}
