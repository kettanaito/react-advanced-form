/**
 * Synchronously validate the provided field.
 */
import { List } from 'immutable';
import { composeResult } from './validate';

const schemaSelectors = ['name', 'type'];

const commonErrorTypes = {
  missing: 'missing',
  invalid: 'invalid'
};

/**
 * Applies the given validation schema and returns the immutable map of invalid rules.
 * @param {Map} schema
 * @param {Object} ruleArgs
 * @return {Map}
 */
function applyRulesSchema(schema, ruleArgs) {
  const { fieldProps } = ruleArgs;

  return schemaSelectors.reduce((errorPaths, schemaSelector) => {
    /* Bypass type selectors if at least one name selector rejected previously */
    if ((schemaSelector === 'type')) {
      const hasNamedErrorPath = errorPaths.some(errorPath => (errorPath[0] === 'name'));

      if (hasNamedErrorPath) {
        return errorPaths;
      }
    }

    /* Get rules declaration by the current schema selector */
    const rules = schema.getIn([schemaSelector, fieldProps[schemaSelector]]);

    /* Bypass empty rules set */
    if (!rules || (rules.size === 0)) return errorPaths;

    /* Handle single functional rules */
    if ((typeof rules === 'function')) {
      const isExpected = rules(ruleArgs);

      return isExpected
        ? errorPaths
        : errorPaths.push([schemaSelector, fieldProps[schemaSelector], 'invalid']);
    }

    /**
     * Keep error paths mutable to be able to get error message like:
     * messages.getIn(errorPath);
     * That doesn't work with List as "errorPath".
     */
    const nextErrorPaths = rules.reduce((list, rule, ruleName) => {
      return rule(ruleArgs) ? list : list.concat([[
        schemaSelector,
        fieldProps[schemaSelector],
        'rules',
        ruleName
      ]]);
    }, []);

    if (nextErrorPaths.length > 0) {
      return errorPaths.push(...nextErrorPaths);
    }

    return errorPaths;
  }, List());
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
    return composeResult(false, List([[commonErrorTypes.missing]]));
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
      return composeResult(false, List([[commonErrorTypes.invalid]]));
    }
  }

  /**
   * Form-level validation.
   * A form-wide validation provided by "rules" property of the Form.
   * The latter property is also inherited from the context passed by FormProvider.
   */
  const ruleArgs = {
    value,
    fieldProps: mutableFieldProps,
    fields: fields.toJS(),
    form
  };

  const errorPaths = applyRulesSchema(formRules, ruleArgs);

  if (errorPaths.size > 0) {
    return composeResult(false, errorPaths);
  }

  return composeResult(true);
}
