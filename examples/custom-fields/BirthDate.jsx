import React from 'react'
import { Form } from 'react-advanced-form'
import { BirthDate } from '@examples/fields'

const birthDateRules = {
  year: ({ date }) => date.year.length === 4,
  month: ({ date }) => date.month >= 1 && date.month <= 12,
  day: ({ date }) => date.day >= 1 && date.day <= 31,
}

const rules = {
  name: {
    birthDate: birthDateRules,
    birthDateTwo: birthDateRules,
  },
}

export const messages = {
  general: {
    invalid: 'General invalid',
  },
  name: {
    birthDate: {
      rule: {
        year: 'Invalid year',
        month: 'Invalid month',
        day: 'Invalid day',
      },
    },
  },
}

export default class BirthDateExample extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1>BirthDate</h1>

        <Form rules={rules} messages={messages}>
          <BirthDate name="birthDate" label="Birth date" />
          <BirthDate
            name="birthDateTwo"
            label="Birth date (initial value)"
            date="1999-12-10"
          />
        </Form>
      </React.Fragment>
    )
  }
}
