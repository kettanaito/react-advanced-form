import { fromJS } from 'immutable';
import { expect } from 'chai';
import { form } from '../../utils';
import { flushFieldRefs, fieldUtils } from '../../../src/utils';

describe('flushFieldRefs', function () {
  it('Flushes referenced field paths properly', () => {
    const fields = fromJS({ fieldOne: { value: 'foo' } });
    const method = ({ getFieldProp }) => {
      getFieldProp(['fieldOne', 'value']);
      getFieldProp(['groupOne', 'fieldOne', 'required']);
    };

    const getFieldProp = fieldUtils.createPropGetter(fields);
    const { refs } = flushFieldRefs(method, {
      getFieldProp,
      fields,
      form
    });

    expect(refs).to.be.an.instanceof(Array).with.lengthOf(2);
    expect(refs[0]).to.deep.equal(['fieldOne', 'value']);
    expect(refs[1]).to.deep.equal(['groupOne', 'fieldOne', 'required']);
  });

  it('Resolves initial value properly', () => {
    const fields = fromJS({ fieldOne: { value: 'foo' } });
    const method = ({ getFieldProp }) => {
      getFieldProp(['nonExisting', 'fieldPath', 'propName']);
      return getFieldProp(['fieldOne', 'value']);
    };

    const { initialValue } = flushFieldRefs(method, { fields, form });

    expect(initialValue).to.equal(fields.getIn(['fieldOne', 'value']));
  });
});
