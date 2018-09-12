import React from 'react'
import { FormProvider, Form } from '@lib'
import { Input } from '@fields'

export default class DebounceTime extends React.Component {
  render() {
    return (
      <div>
        <h1>FormProvider</h1>
        <FormProvider>
          <Form>
            <Input
              name="fieldOne"
              label="Field with default debounce time"
              rule={/foo/}
            />
          </Form>
        </FormProvider>

        <FormProvider debounceTime={0}>
          <Form>
            <Input
              name="fieldTwo"
              label="Field with custom debounce time"
              rule={/foo/}
            />
          </Form>
        </FormProvider>
      </div>
    )
  }
}
