import React from 'react'
import { FormProvider, Form } from '@lib'
import { Input } from '@fields'

export default class DebounceTime extends React.Component {
  render() {
    return (
      <div>
        <h3>Default debounce time</h3>
        <FormProvider>
          <Form>
            <Input id="fieldOne" name="foo" rule={/foo/} />
          </Form>
        </FormProvider>

        <div>Custom debounce time</div>
        <FormProvider debounceTime={0}>
          <Form>
            <Input id="fieldTwo" name="foo" rule={/foo/} />
          </Form>
        </FormProvider>
      </div>
    )
  }
}
