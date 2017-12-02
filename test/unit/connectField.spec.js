import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { connectField, Form, Field } from '../../lib';

describe('connectField', () => {
  const CustomField = (props) => (
    <div>
      <Field.Input {...props} />
    </div>
  );

  const ConnectedCustomField = connectField(CustomField);

  it('Should foo', () => {
    const wrapper = shallow(

      <Form messages={{ general: {} }}>
        <ConnectedCustomField id="field" name="myField" />
      </Form>
    );

    const nativeField = wrapper.find(Field);
    console.log(wrapper.find(Field));
    console.log(nativeField.props());
  });
});
