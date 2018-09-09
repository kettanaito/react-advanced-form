import * as recordUtils from '../../recordUtils'
import resolveMessage from './resolveMessage'

const fieldOne = recordUtils.createField({
  name: 'fieldOne',
  fieldPath: ['fieldOne'],
  value: 'foo',
})

const fieldTwo = recordUtils.createField({
  name: 'fieldTwo',
  fieldPath: ['fieldTwo'],
  value: 'bar',
})

const resolverArgs = {
  fieldProps: fieldOne,
  fields: { fieldOne, fieldTwo },
}

test('Returns plain string', () => {
  const message = resolveMessage('String message')
  expect(message).toEqual('String message')
})

test('Executes message resolver and returns a proper message', () => {
  const resolver = ({ fieldProps, fields }) => {
    return `String ${fieldProps.value} ${fields.fieldTwo.value}`
  }

  const message = resolveMessage(resolver, resolverArgs)
  expect(message).toEqual('String foo bar')
})
