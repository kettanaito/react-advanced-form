import { fromJS } from 'immutable';
import { expect } from 'chai';
import { flushFieldRefs } from '../../../src/utils';

describe('flushFieldRefs', function () {
  it('Flushes referenced field paths properly', () => {
    const fields = fromJS({ fieldOne: { value: 'foo' } });
    const method = ({ fields }) => {
      fields.fieldOne.value;
      fields.groupOne.fieldOne.required;
    };

    const { refs } = flushFieldRefs(method, { fields });

    expect(refs).to.be.an.instanceof(Array).with.lengthOf(2);
    expect(refs[0]).to.deep.equal(['fieldOne', 'value']);
    expect(refs[1]).to.deep.equal(['groupOne', 'fieldOne', 'required']);
  });

  it('Resolves initial value properly', () => {
    const fields = fromJS({ fieldOne: { value: 'foo' } });
    const method = ({ fields }) => {
      fields.nonExisting.fieldPath.propName;
      return fields.fieldOne.value;
    };

    const { initialValue } = flushFieldRefs(method, { fields });

    expect(initialValue).to.equal(fields.getIn(['fieldOne', 'value']));
  });
});
