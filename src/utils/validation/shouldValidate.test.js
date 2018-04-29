import { expect } from 'chai';
import defineValidationTypes, { validationTypes } from './defineValidationTypes';
import * as recordUtils from '../recordUtils';

describe('defineValidationTypes', () => {
  it('Returns both validation types for pristine field', () => {
    const fieldRecord = recordUtils.createField({
      name: 'field'
    });

    const validationTypes = defineValidationTypes(fieldRecord);
    expect(validationTypes).to.be.an.instanceof(Array).that.deep.equals(validationTypes);
  });

  it('Returns async validation type for sync valid fields', () => {
    const fieldRecord = recordUtils.createField({
      name: 'field',
      validatedSync: true,
      validSync: true
    });

    const validationTypes = defineValidationTypes(fieldRecord);
    expect(validationTypes).to.be.an.instanceOf(Array).that.deep.equals(['async']);
  });
});
