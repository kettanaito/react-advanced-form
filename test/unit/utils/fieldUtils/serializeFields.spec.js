import { expect } from 'chai';
import { fromJS } from 'immutable';
import { fieldUtils } from '../../../../src/utils';

describe('serializeFields', function () {
  it('Serializes different field types properly', () => {
    const fields = fromJS({
      text: { fieldPath: 'text', value: 'text', valuePropName: 'value' },
      textEmpty: { fieldPath: 'fieldTwo', value: '', valuePropName: 'value' },
      checkbox: { fieldPath: 'checkbox', type: 'checkbox', checked: false, valuePropName: 'checked' },
      select: { fieldPath: 'select', type: 'select', value: 'select', valuePropName: 'value' },
      textarea: { fieldPath: 'textarea', type: 'textarea', value: 'textarea', valuePropName: 'value' },
      radio: { fieldPath: 'radio', type: 'radio', value: 'radio', valuePropName: 'value' }
    });

    const serialized = fieldUtils.serializeFields(fields).toJS();

    expect(serialized).to.deep.eq({
      text: 'text',
      checkbox: false,
      select: 'select',
      textarea: 'textarea',
      radio: 'radio'
    });
  });

  it('Serializes groupped fields properly', () => {
    const fields = fromJS({
      fieldOne: { fieldPath: 'fieldOne', value: 'one', valuePropName: 'value' },
      fieldTwo: { fieldPath: 'groupOne.fieldTwo', value: 'two', valuePropName: 'value' },
      fieldThree: { fieldPath: 'fieldThree', value: 'three', valuePropName: 'value' },
      fieldFour: { fieldPath: 'groupOne.fieldFour', value: 'four', valuePropName: 'value' },
      fieldFive: { fieldPath: 'groupTwo.fieldFive', value: 'five', valuePropName: 'value' },
    });

    const serialized = fieldUtils.serializeFields(fields).toJS();

    expect(serialized).to.deep.equal({
      fieldOne: 'one',
      fieldThree: 'three',
      groupOne: {
        fieldTwo: 'two',
        fieldFour: 'four'
      },
      groupTwo: {
        fieldFive: 'five'
      }
    });
  });

  it('Bypass the fields marked as "skip"', () => {
    const fields = fromJS({
      fieldOne: { fieldPath: 'fieldOne', value: 'foo', valuePropName: 'value' },
      fieldTwo: { fieldPath: 'fieldTwo', value: 'skipped', valuePropName: 'value', skip: true },
      fieldThree: { fieldPath: 'fieldThree', value: '123', valuePropName: 'value' }
    });

    const serialized = fieldUtils.serializeFields(fields).toJS();

    expect(serialized).to.deep.equal({
      fieldOne: 'foo',
      fieldThree: '123'
    });
  });
});
