import React from 'react';
import { Form } from '@lib';
import Select from './Select';

const options = [
  { value: 'meat', label: 'Meat' },
  { value: 'vegetables', label: 'Vegetables' },
  { value: 'chocolate', label: 'Chocolate' }
];

export default class ReactSelectExample extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1>react-select</h1>

        <Form>
          <Select
            name="food"
            label="Choose a single favorite food"
            options={ options } />

          <Select
            name="multipleValues"
            label="Choose multiple values"
            options={ options }
            multi />
        </Form>
      </React.Fragment>
    );
  }
}