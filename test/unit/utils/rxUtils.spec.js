import { expect } from 'chai';
import { Map } from 'immutable';
import { rxUtils } from '../../../src/utils';

describe('rxUtils', function () {
  it('getRxProps', () => {
    const fieldProps = Map({ required: false });
    const rxFieldProps = Map({ required: () => false });
    const rxPropsOne = rxUtils.getRxProps(rxFieldProps);
    const rxPropsTwo = rxUtils.getRxProps(fieldProps);

    expect(rxPropsOne.toJS()).to.have.all.keys(['required']);
    expect(rxPropsTwo.toJS()).to.deep.equal({});
  });
});
