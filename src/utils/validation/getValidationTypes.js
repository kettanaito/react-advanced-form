// @flow
import type { TValidationType } from './validationTypes';

import validationTypes from './validationTypes';

/**
 * Returns the list of the validation types necessary to perform on the given field.
 */
export default function getValidationTypes(fieldRecord, form): TValidationType[] {
  const { rxRules: schema } = form.state;

  return Object.values(validationTypes).filter((validationType) => {
    return validationType.shouldValidate(fieldRecord, schema);
  });
}
