import validationTypes from '../const/validation-types';

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

  isValidated(fieldProps) {
    return this.types.every(type => fieldProps.get(`validated${type.name}`));
  }
}

/* Validation types instances */
export const SyncValidationType = new ValidationType(validationTypes.sync);
export const AsyncValidationType = new ValidationType(validationTypes.async);
export const BothValidationType = new ValidationType(validationTypes.both);
