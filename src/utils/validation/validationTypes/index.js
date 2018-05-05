// @flow
import type { TValidationResult } from '../createValidationResult';

import getRules from '../getRules';
import validateSync from './validateSync';
import validateAsync from './validateAsync';

export type TValidationType = {
  shouldValidate: () => boolean,
  validator: () => TValidationResult
};

export type TValidationTypes = {
  [typeName: string]: TValidationType
};

const validationTypes: TValidationTypes = {
  sync: {
    name: 'sync',
    validator: validateSync,
    shouldValidate(fieldRecord, schema) {
      console.groupCollapsed('validateSync @ shouldValidate @ `%s`', fieldRecord.name);
      console.log('fieldRecord:', fieldRecord && fieldRecord.toJS());

      if (fieldRecord.validSync) {
        console.log('already valid, bypassing...');
        console.groupEnd();

        return false;
      }

      const fieldRules = getRules(fieldRecord, schema);

      const res = (
        fieldRecord.rule ||
        fieldRules.type ||
        fieldRules.name ||
        fieldRecord.required
      );

      console.warn('should validate?', res);
      console.groupEnd();

      return res;
    }
  },
  async: {
    name: 'async',
    validator: validateAsync,
    shouldValidate(fieldRecord) {
      const shouldValidate = (fieldRecord.validSync && fieldRecord.asyncRule && !fieldRecord.validAsync);

      console.groupCollapsed('validateAsync @ shouldValidate @ `%s`', fieldRecord.name);
      console.log('field record', fieldRecord && fieldRecord.toJS());
      console.warn('should validate?', shouldValidate);
      console.groupEnd();

      return shouldValidate;
    }
  }
};

export default validationTypes;
