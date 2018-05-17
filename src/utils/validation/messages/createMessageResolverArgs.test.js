import { expect } from 'chai'
import createMessageResolverArgs from './createMessageResolverArgs'

test('Creates a proper message resolver args', () => {
  const messageResolverArgs = createMessageResolverArgs({
    value: {},
    fieldProps: {},
    fields: {},
    form: {},
  })

  expect(messageResolverArgs)
    .to.be.an('object')
    .that.has.all.keys(['value', 'fieldProps', 'fields', 'form'])
})

test('Propagates "extra" parameters', () => {
  const messageResolverArgs = createMessageResolverArgs(
    {
      value: {},
      fieldProps: {},
      fields: {},
      form: {},
    },
    {
      extraProp: 'foo',
    },
  )

  expect(messageResolverArgs)
    .to.be.an('object')
    .that.has.all.keys(['value', 'fieldProps', 'fields', 'form', 'extraProp'])
})
