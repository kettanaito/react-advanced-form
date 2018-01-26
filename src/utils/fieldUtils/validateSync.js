/**
 * Synchronously validate the provided field.
 */
const schemaSelectors = ['type', 'name'];

const commonErrorTypes = {
  missing: 'missing',
  invalid: 'invalid'
};

/**
 * Shorthand function to return a unified validation result Object.
 */
const getResult = (expected, errorType) => ({ expected, errorType });

/**
 * Applies the given validation schema and returns the immutable map of invalid rules.
 * @param {Map} schema
 * @param {Object} ruleArgs
 * @return {Map}
 */
function applyRulesSchema(schema, ruleArgs) {
  const { fieldProps } = ruleArgs;

  return schemaSelectors.reduce((invalidRules, schemaSelector) => {
    const rules = schema.getIn([schemaSelector, fieldProps[schemaSelector]]);

    /* Bypass empty rules set */
    if (!rules || (rules.size === 0)) return invalidRules;

    const existingInvalidRules = invalidRules[schemaSelector] || [];

    /* Handle single functional rules */
    if ((typeof rules === 'function')) {
      const isExpected = rules(ruleArgs);
      if (!isExpected) invalidRules.push([schemaSelector, fieldProps[schemaSelector], 'invalid']);

      return invalidRules;
    }

    const nextInvalidRules = rules.reduce((list, rule, ruleName) => {
      return rule(ruleArgs) ? list : list.concat([
        [
          schemaSelector,
          fieldProps[schemaSelector],
          'rules',
          ruleName
        ]
      ]);
    }, []);

    if (nextInvalidRules.length > 0) {
      invalidRules.push(...nextInvalidRules);
    }

    return invalidRules;
  }, []);
}

// function applyValidationGroup(group, ruleArgs) {
//   // converting to immutable here is redundant, remove it
//   const endGroup = (typeof group === 'function') ? Map({ [commonErrorTypes.invalid]: group }) : group;

//   return endGroup.reduce((invalidKeys, rule, ruleName) => {
//     return rule(ruleArgs) ? invalidKeys : invalidKeys.concat(ruleName);
//   }, []);
// }

export default function validateSync({ fieldProps, fields, form, formRules }) {
  /* Bypass validation for already valid field */
  if (fieldProps.get('validSync')) return getResult(true);

  /* Get properties shorthand references */
  const name = fieldProps.get('name');
  const type = fieldProps.get('type');
  const value = fieldProps.get('value');
  const required = fieldProps.get('required');
  const rule = fieldProps.get('rule');
  const asyncRule = fieldProps.get('asyncRule');

  /* Empty optional fields are expected */
  if (!value && !required) return getResult(true);

  /* Empty required fields are unexpected */
  if (!value && required) return getResult(false, commonErrorTypes.missing);

  /* Assume Field doesn't have any relevant validation rules */
  const hasFormNameRules = formRules.hasIn(['name', name]);
  const hasFormTypeRules = formRules.hasIn(['type', type]);
  const hasFormRules = hasFormNameRules || hasFormTypeRules;

  if (!rule && !asyncRule && !hasFormRules) return getResult(true);

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

    if (!isExpected) return getResult(false,commonErrorTypes.invalid);
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

  const invalidRules = applyRulesSchema(formRules, ruleArgs);
  if (invalidRules.length > 0) return getResult(false, invalidRules);

  return getResult(true);
}
