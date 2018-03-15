/**
 * Synchronous validation of a field.
 */
import { commonErrorTypes, createRejectedRule, composeResult } from './validate';
import { ruleSelectors } from '../formUtils/getFieldRules';
import ensafeMap from '../ensafeMap';
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
  const { fieldProps, fields: fieldsOrigin, form } = resolverArgs;

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
      const { refs, name, selector, resolver } = rule;
      const fields = ensafeMap(fieldsOrigin, refs);

      // Cannot use Immutable instances in the resolver since it's unclear how to proxy them
      const isExpected = dispatch(resolver, { ...resolverArgs, fields }, { withImmutable: false });

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

export default function validateSync({ fieldProps, fields, form }) {
  /* Get properties shorthand references */
  const name = fieldProps.get('name');
  const type = fieldProps.get('type');
  const valuePropName = fieldProps.get('valuePropName');
  const value = fieldProps.get(valuePropName);
  const required = fieldProps.get('required');
  const rule = fieldProps.get('rule');
  const asyncRule = fieldProps.get('asyncRule');
  const { rxRules } = form.state;

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
  const hasFormNameRules = rxRules.has(`name.${name}`);
  const hasFormTypeRules = rxRules.has(`type.${type}`);
  const hasFormRules = hasFormNameRules || hasFormTypeRules;

  if (!rule && !asyncRule && !hasFormRules) {
    return composeResult(true);
  }

  if (rule) {
    //
    // TODO Make observable and ensafe {Field.props.rule} resolver as well.
    //
    const isExpected = (typeof rule === 'function')
      /* Enfore mutability of args for fields proxying */
      ? dispatch(rule, { value, fieldProps, fields, form }, { withImmutable: false })
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
  const rejectedRules = getRejectedRules({ value, fieldProps, fields, form });

  if (rejectedRules.length > 0) {
    return composeResult(false, rejectedRules);
  }

  return composeResult(true);
}
