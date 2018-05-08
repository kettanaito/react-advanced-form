import React from 'react'
import { Form } from '@lib'
import Button from '@shared/Button'
import Select from './Select'

const options = [
  { value: 'meat', label: 'Meat' },
  { value: 'vegetables', label: 'Vegetables' },
  { value: 'chocolate', label: 'Chocolate' },
]

export default class ReactSelectExample extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1>react-select</h1>

        <Form onSubmitStart={this.props.onSubmitStart}>
          <Select name="food" label="Choose a single value" options={options} />
          <Select name="multipleValues" label="Choose multiple values" options={options} multi />

          <Button>Submit</Button>
        </Form>
      </React.Fragment>
    )
  }
}
