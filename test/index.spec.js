import { expect } from 'chai';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import * as libExports from '../';

configure({ adapter: new Adapter() });

describe('General', () => {
  it('Library exports are fine', () => {
    expect(libExports).to.have.all.keys([
      'createField',
      'fieldPresets',
      'applyEnhancers',
      'FormProvider',
      'Form',
      'Field',
      'Condition'
    ]);
  });
});

/* Unit tests */
require('./unit');
