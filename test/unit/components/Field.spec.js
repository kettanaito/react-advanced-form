import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { defer } from '../../common';
import { Form, Field } from '../../../lib';

describe('Field', function () {
  it('Allows undefined "initialValue"', () => {
    const initialValue = undefined;

    const createWrapper = () => mount(
      <Form>
        <Field.Input
          name="foo"
          initialValue={ undefined }
          required />
        <Field.Input
          name="abc"
          initialValue={ undefined } />
      </Form>
    );

    expect(createWrapper).not.to.throw();
    const wrapper = createWrapper();

    return defer(async () => {
      const form = wrapper.find(Form).instance();
      const input = form.state.fields.get('foo');

      expect(input).to.not.be.undefined;
      expect(input.get('initialValue')).to.equal(undefined);
    });
  });
});