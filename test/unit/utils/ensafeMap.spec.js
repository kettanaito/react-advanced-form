import { Map } from 'immutable';
import { expect } from 'chai';
import { ensafeMap } from '../../../src/utils';

describe('ensafeMap', function () {
  it('Allows to reference non-existing key paths', () => {
    const origin = Map();
    const safeMap = ensafeMap(origin, [
      ['non', 'existing', 'key', 'path'],
      ['another', 'made', 'up', 'path']
    ]);
    const mutableSafeMap = safeMap.toJS();

    expect(mutableSafeMap.non.existing.key.path).to.be.undefined;
    expect(mutableSafeMap.another.made.up.path).to.be.undefined;
  });
});
