import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Map } from 'immutable';
import { connectField, Form, Field } from '../../../lib';
import { defer } from '../../common';

describe('connectField', () => {
  it('Wrapped field is registered with correct "fieldPath"', (done) => {
    const CustomField = props => (
      <div>
        <Field.Input {...props} />
      </div>
    );

    const WrappedField = connectField(CustomField);

    const wrapper = mount(
      <Form>
        <WrappedField name="username" required />
      </Form>
    );

    defer(() => {
      const form = wrapper.find(Form).instance();
      expect(form.state.fields.has('username')).to.be.true;

      return done();
    });
  });

  it('Wrapped field has access to the native Field props', (done) => {
    const CustomField = props => (
      <div>
        <Field.Input {...props} />
      </div>
    );

    const WrappedField = connectField(CustomField);

    const wrapper = mount(
      <Form>
        <WrappedField name="username" required />
      </Form>
    );

    defer(() => {
      const customField = wrapper.find(CustomField);

      expect(customField.props()).to.have.all.keys([
        'name',
        'required',
        'focused',
        'disabled',
        'validating',
        'validatedSync',
        'validatedAsync',
        'validSync',
        'validAsync',
        'expected',
        'valid',
        'invalid',
        'error'
      ]);

      return done();
    });
  });

  it('Wrapped field within Field.Group registers with the correct "fieldPath"', (done) => {
    const CustomField = props => (
      <div>
        <Field.Input {...props} />
      </div>
    );

    const WrappedField = connectField(CustomField);

    const wrapper = mount(
      <Form>
        <Field.Group name="primaryInfo">
          <WrappedField name="username" required />
        </Field.Group>
      </Form>
    );

    defer(() => {
      const form = wrapper.find(Form).instance();
      const groupedField = form.state.fields.get('primaryInfo.username');

      expect(groupedField).to.be.instanceOf(Map);
      expect(groupedField.get('name')).to.equal('username');
      expect(groupedField.get('fieldPath')).to.equal('primaryInfo.username');

      return done();
    });
  });
});
