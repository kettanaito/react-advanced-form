import { expect } from 'chai';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import * as libExports from '../lib';

configure({ adapter: new Adapter() });

describe('Basics', () => {
  it('Library exports are fine', () => {
    expect(libExports).to.have.all.keys([
      'connectField',
      'createField',
      'FormProvider',
      'Form',
      'Field',
      'Condition'
    ]);
  });
});

/* Unit tests */
require('./unit');
