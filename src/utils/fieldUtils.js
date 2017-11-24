export function getFieldPath({ name, fieldGroup }) {
  const fieldPath = fieldGroup ? [fieldGroup, name] : [name];

  // console.groupCollapsed(name, '@ getFieldPath');
  // console.log('fieldGroup', fieldGroup);
  // console.log('fieldPath', fieldPath);
  // console.groupEnd();

  return fieldPath;
}

export function getFieldProps(fieldPath, fields, fallbackProps) {
  const contextProps = fields.getIn(fieldPath);
  return contextProps ? contextProps.toJS() : fallbackProps;
}

/**
 * Resolves the given prop name of the field.
 * @param {string} propName
 * @param {object} fieldProps
 * @param {Map} fields
 */
export function resolveProp({ propName, fieldProps, fields }) {
  console.groupCollapsed(`fieldUtils @ resolveProp "${propName}"`, fieldProps.name);
  console.log('fieldProps', fieldProps);

  const propValue = fieldProps[propName];

  if (typeof propValue === 'function') {
    console.log('prop is a function, should resolve...');
    console.log('fields', fields);

    const resolvedPropValue = propValue({ fieldProps, fields: fields.toJS() });

    console.log('resolved prop value:', resolvedPropValue);

    console.groupEnd();

    return resolvedPropValue;
  }

  console.log(`prop "${propName}" is not a function, return as is:`, propValue);
  console.groupEnd();

  return propValue;
}

/**
 * Determines whether a Field with the provided props should be validated.
 * @param {object} fieldProps
 */
export function shouldValidateField({ fieldProps }) {
  const isValidated = fieldProps.validated;
  const isDynamicRequired = (typeof fieldProps.required === 'function');
  const shouldValidate = !isValidated || isDynamicRequired;

  console.groupCollapsed('fieldUtils @ shouldValidateField', fieldProps.name);
  console.log('was validated before:', fieldProps.validated);
  console.log('"required" prop is dynamic (func):', isDynamicRequired);
  console.log('should validate:', shouldValidate);
  console.groupEnd();

  return shouldValidate;
}

/**
 * Determines whether the given Field is valid.
 * Validation of each field is a complex process consisting of several steps.
 * It is important to resolve the validation immediately once the field becomes invalid.
 * @param {object} fieldProps
 * @return {boolean}
 */
export async function isExpected({ fieldProps, fields, formProps, formRules = {} }) {
  let hasExpectedValue = true;
  const { name, value, rule, asyncRule } = fieldProps;

  /* Resolve resolvable props */
  const required = resolveProp({
    propName: 'required',
    fieldProps,
    fields
  });

  console.groupCollapsed('fieldUtils @ isExpected', name);
  console.log('fieldProps', fieldProps);
  console.log('required:', required);
  console.log('value:', value);

  /* Allow non-required fields to be empty */
  if (!value) {
    console.log('expected:', !required);
    console.groupEnd();

    return !required;
  }

  /* Assume Field doesn't have any specific validation attached */
  const formTypeRule = formRules.type && formRules.type[name];
  const formNameRule = formRules.name && formRules.name[name];
  const hasFormRules = formTypeRule || formNameRule;

  if (!rule && !asyncRule && !hasFormRules) {
    console.groupEnd();

    return hasExpectedValue;
  }

  /**
   * Format validation.
   * The first step of validation is to ensure a proper format.
   * This is the most basic validation, therefore it should pass first.
   */
  if (rule) {
    console.log('Field has "rule":', rule);
    /* Test the RegExp against the field's value */
    hasExpectedValue = rule.test(value);

    console.log('hasExpectedValue:', hasExpectedValue);
    if (!hasExpectedValue) {
      console.groupEnd();

      return hasExpectedValue;
    }
  }

  /**
   * Form-level validation.
   * The last level of validation is a form-wide validation provided by "rules" property of the Form.
   * The latter property is also inherited from the context passed by FormProvider.
   */
  if (hasFormRules) {
    console.groupEnd();

    /**
     * Form-level validation.
     */
    const isValidByType = formTypeRule ? formTypeRule(value, fieldProps, formProps) : true;
    const isValidByName = formNameRule ? formNameRule(value, fieldProps, formProps) : true;
    hasExpectedValue = isValidByType && isValidByName;

    console.log('hasExpectedValue:', hasExpectedValue);
    if (!hasExpectedValue) {
      console.groupEnd();

      return hasExpectedValue;
    }
  }

  /**
   * Field: Asynchronous validation.
   * Each field may have an async rule. The latter is a function which returns a Promise, which is
   * being executed right after.
   */
  if (asyncRule) {
    console.log('Field has asynchronous rule, calling...');

    try {
      await asyncRule({
        value,
        fieldProps,
        formProps
      });
    } catch (error) {
      hasExpectedValue = false;
    }
  }

  console.log('hasExpectedValue:', hasExpectedValue);

  console.groupEnd();

  return hasExpectedValue;
}

/**
 * Returns whether the field is valid in the given context.
 * Field cannot rely on "valid" prop alone. Consider this:
 * - valid when it has value, has been validated and is indeed valid
 * - invalid - when it has been validated, but it's not valid
 */
export function updateValidState({ fieldProps }) {
  const { name, value, validated, expected } = fieldProps;

  const validState = {
    valid: !!value && validated && expected,
    invalid: validated && !expected
  };

  console.groupCollapsed('fieldUtils @ updateValidState', name);
  console.log('value', value);
  console.log('validated', validated);
  console.log('expected', expected);
  console.log('validState', validState);
  console.groupEnd();

  return validState;
}

export function traverse(fields, iterator) {
  return fields.reduce((entries, field) => {
    console.log('iterating through', field.toJS());
    console.log('entries:', entries);

    const isGroup = !field.has('name');

    if (isGroup) {
      console.log('IS A GROUP! GO DEEPER');
      return entries.concat(traverse(field, iterator));
    }

    // validate
    return entries.concat(iterator(field));
  }, []);
}
