import React from 'react'
import { Form } from 'react-advanced-form'
import Button from '@examples/shared/Button'
import Select from './Select'

const options = [
  { value: 'meat', label: 'Meat' },
  { value: 'vegetables', label: 'Vegetables' },
  { value: 'chocolate', label: 'Chocolate' },
]

export default class ReactSelectExample extends React.Component {
  transformSerialized = ({ serialized }) => {
    const { food, multipleValues } = serialized

    /* Transform serialized fields to include "value" property of selected options */
    return {
      food: food.value,
      multipleValues: multipleValues.map((option) => option.value),
    }
  }

  render() {
    return (
      <React.Fragment>
        <h1>react-select</h1>

        <Form
          onSerialize={this.transformSerialized}
          onSubmitStart={this.props.onSubmitStart}
        >
          <Select name="food" label="Choose a single value" options={options} />
          <Select
            name="multipleValues"
            label="Choose multiple values"
            options={options}
            isMulti
          />

          <Button>Submit</Button>
        </Form>
      </React.Fragment>
    )
  }
}
