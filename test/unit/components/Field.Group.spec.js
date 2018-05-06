import React from 'react';
import { expect } from 'chai';
import { Record } from 'immutable';
import { mount } from 'enzyme';
import { Input } from '../../../examples/fields';
import { validationRules, validationMessages } from '../../utils';
import { Form, Field } from '../../..';

describe('Field.Group', function () {
  const wrapper = mount(
    <Form rules={ validationRules } messages={ validationMessages }>
      <Field.Group name="primaryInfo">
        <Input name="username" value="foo" />
      </Field.Group>
      <Input name="username" value="doe" />
    </Form>
  );

  it('Grouped fields are registered with the correct "fieldPath"', () => {
    const expectedFieldPath = ['primaryInfo', 'username'];
    const groupedField = wrapper.state().fields.getIn(expectedFieldPath);

    /* Field should be accessible in the Form's state under the proper field path */
    expect(Record.isRecord(groupedField));

    /* The name of the field should be intact */
    expect(groupedField.name).to.equal('username');

    /* The field path should include field group name and the field name */
    expect(groupedField.fieldPath).to.deep.equal(expectedFieldPath);

    /* Ensure this is the grouped field */
    expect(groupedField.value).to.equal('foo');
  });

  it('Grouped field and ungrouped field with the same names are allowed', () => {
    const { fields } = wrapper.state();
    const ungroupedField = fields.get('username');
    const grouppedField = fields.getIn(['primaryInfo', 'username']);

    expect(ungroupedField).to.not.be.undefined;
    expect(grouppedField).to.not.be.undefined;
    expect(ungroupedField.value).to.equal('doe');
    expect(grouppedField.value).to.equal('foo');
  });
});
