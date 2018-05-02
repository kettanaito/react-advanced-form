// @flow
import type { TValidationType } from './validationTypes';

import allValidationType from './validationTypes';

/**
 * Returns the list of the validation types necessary to perform on the given field.
 */
export default function getApplicableValidations(fieldRecord, form, explicitTypes = null): TValidationType[] {
  const { rxRules: schema } = form.state;
  const validationTypes = explicitTypes || allValidationType;

  return Object.values(validationTypes).filter((validationType) => {
    return validationType.shouldValidate(fieldRecord, schema);
  });
}
