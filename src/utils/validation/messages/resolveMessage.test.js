import { expect } from 'chai'
import { Map } from 'immutable'
import * as recordUtils from '../../recordUtils'
import resolveMessage from './resolveMessage'

const fieldOne = recordUtils.createField({
  name: 'fieldOne',
  value: 'foo',
})

const fieldTwo = recordUtils.createField({
  name: 'fieldTwo',
  value: 'bar',
})

const resolverArgs = {
  fieldProps: fieldOne,
  fields: Map({ fieldOne, fieldTwo }),
  form: {
    context: {
      withImmutable: false,
    },
  },
}

test('Returns plain string', () => {
  const message = resolveMessage('String message')
  expect(message).to.equal('String message')
})

test('Executes message resolver and returns a proper message', () => {
  const resolver = ({ fieldProps, fields }) => {
    return `String ${fieldProps.value} ${fields.fieldTwo.value}`
  }

  const message = resolveMessage(resolver, resolverArgs)
  expect(message).to.equal('String foo bar')
})
