import React from 'react'
import { Form } from 'react-advanced-form'
import Button from '@examples/shared/Button'
import Slider from './Slider'

export default class SliderExample extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1>react-slider</h1>

        <Form onSubmitStart={this.props.onSubmitStart}>
          <Slider
            name="singleValue"
            label="Select a single value"
            max={100}
            defaultValue={50}
          />
          <Slider
            name="priceRange"
            label="Select price range"
            min={100}
            max={5000}
            step={100}
            minDistance={700}
            defaultValue={{
              from: 1500,
              to: 3500,
            }}
          />

          <Button>Submit</Button>
        </Form>
      </React.Fragment>
    )
  }
}
