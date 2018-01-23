import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Input } from '../../components';
import { defer } from '../../common';
import { Form } from '../../../lib';

describe('Field', function () {
  it('Allows undefined "initialValue"', () => {
    const initialValue = undefined;

    const createWrapper = () => mount(
      <Form>
        <Input
          name="foo"
          initialValue={ undefined }
          required />
        <Input
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