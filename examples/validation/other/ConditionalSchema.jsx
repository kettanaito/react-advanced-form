import React from 'react'
import { FormProvider, Form } from 'react-advanced-form'
import { Input } from '@examples/fields'
import Button from '@examples/shared/Button'

const providerRulesOne = {
  name: {
    fieldThree: ({ value }) => value !== '123',
  },
}

const formRulesOne = {
  name: {
    fieldOne: ({ value }) => value === 'foo',
    fieldTwo: ({ value }) => value !== 'bar',
  },
}

const formRulesTwo = {
  name: {
    fieldOne: ({ value }) => value === 'bar',
  },
}

export default class ConditionalSchema extends React.Component {
  state = {
    flag: true,
    formRules: formRulesOne,
    providerRules: null,
  }

  toggleProviderRules = () => {
    this.setState(({ providerRules }) => ({
      providerRules: providerRules ? null : providerRulesOne,
    }))
  }

  render() {
    const { providerRules, formRules } = this.state

    return (
      <FormProvider rules={providerRules}>
        <h1>Conditional schema</h1>

        <Form rules={{ extend: true, ...formRules }}>
          <Input
            name="fieldOne"
            label="Field one"
            hint={
              <span>
                Validates differently based on <code>form.props.rules</code>
              </span>
            }
            required
          />

          <Input name="fieldTwo" label="Field two" initialValue="bar" />
          <Input
            name="fieldThree"
            label="Field three"
            initialValue="123"
            hint={providerRules && 'Uses rules from FormProvider'}
          />
        </Form>

        <Button id="provider-one" onClick={this.toggleProviderRules}>
          Toggle provider rules
        </Button>

        <Button
          id="form-one"
          onClick={() => this.setState({ formRules: formRulesOne })}
        >
          Use first schema
        </Button>
        <Button
          id="form-two"
          onClick={() => this.setState({ formRules: formRulesTwo })}
        >
          Use second schema
        </Button>
      </FormProvider>
    )
  }
}
