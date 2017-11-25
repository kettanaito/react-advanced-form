/**
 * Gets the reference path of the field within the form's state/context.
 * Field's path includes field's group, when the latter is wrapping the field in the markup.
 * @param {string} name
 * @param {?string} fieldGroup
 */
export function getFieldPath({ name, fieldGroup }) {
  return fieldGroup ? [fieldGroup, name] : [name];
}

/**
 * Returns the props of the given field based on the presence of the latter in the form's state/context.
 * In case the field is not yet registered in the form's state, returns the fallback props provided.
 * @param {Array<string>} fieldPath
 * @param {Map} fields
 * @param {object} fallbackProps
 */
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
  const propValue = fieldProps[propName];
  if (typeof propValue !== 'function') return propValue;
  return propValue({ fieldProps, fields: fields.toJS() });
}

/**
 * Determines whether a Field with the provided props should be validated.
 * @param {object} fieldProps
 */
export function shouldValidateField({ fieldProps }) {
  const isValidated = fieldProps.validated;
  const hasDynamicRequired = (typeof fieldProps.required === 'function');
  const shouldValidate = !isValidated || hasDynamicRequired;

  console.groupCollapsed('fieldUtils @ shouldValidateField', fieldProps.name);
  console.log('was validated before:', fieldProps.validated);
  console.log('"required" prop is dynamic (func):', hasDynamicRequired);
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

  /* Format (sync) validation */
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
   * A form-wide validation provided by "rules" property of the Form.
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
   * being executed right after. This validation should be resolved as the last one since the purpose of all the
   * previous validations is but to ensure the entered value is expected by the remove end-point (if any).
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
 * @param {object} fieldProps
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

/**
 * Traverses the given immutable fields applying the iterator function to each field, regardless its depth.
 * @param {Map} fields
 * @param {Function: mixed} iterator
 */
export function traverse(fields, iterator) {
  return fields.reduce((entries, field) => {
    /* When current entry doesn't have a "name" prop, means it's a field group */
    if (!field.has('name')) return entries.concat(traverse(field, iterator));

    /* When the entry is a field, apply the iterator function and glue the result to the reduced array */
    return entries.concat(iterator(field));
  }, []);
}
