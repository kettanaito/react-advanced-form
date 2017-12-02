import { expect } from 'chai';
import * as libExports from '../lib';

describe('Basics', () => {
  it('Exports are fine', () => {
    expect(libExports).to.have.all.keys(['connectField', 'FormProvider', 'Form', 'Field', 'Condition']);
  });
});
