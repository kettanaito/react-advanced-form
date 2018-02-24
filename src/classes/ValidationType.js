export const validationTypes = {
  sync: 'Sync',
  async: 'Async',
  both: 'Both'
};

export default class ValidationType {
  constructor(name) {
    this.name = name;

    /* Shorthands */
    this.isSync = (name === validationTypes.sync);
    this.isAsync = (name === validationTypes.async);
    this.isBoth = (name === validationTypes.both);

    /* Compose and store the validation types applicable by the current one */
    this.types = this.isBoth ? [validationTypes.sync, validationTypes.async] : [this.name];

    return this;
  }

  shouldValidate({ fieldProps, formRules }) {
    /* When the current validation type has already been validated, no validation needed */
    const isAlreadyValidated = this.types.every(type => fieldProps.get(`validated${type.name}`));
    if (isAlreadyValidated) {
      return false;
    }

    const fieldName = fieldProps.get('name');
    const fieldType = fieldProps.get('type');

    if (this.types.includes(validationTypes.sync)) {
      if (fieldProps.has('rule')) {
        return true;
      }

      if ((formRules.hasIn(['name', fieldName]) || formRules.hasIn(['type', fieldType]))) {
        return true;
      }
    }

    if (this.types.includes(validationTypes.async)) {
      if (fieldProps.has('asyncRule')) {
        return true;
      }
    }

    /* Empty required fields are to validate */
    if (fieldProps.get('required')) {
      return true;
    }

    return false;
  }
}

/* Validation types instances */
export const SyncValidationType = new ValidationType(validationTypes.sync);
export const AsyncValidationType = new ValidationType(validationTypes.async);
export const BothValidationType = new ValidationType(validationTypes.both);
