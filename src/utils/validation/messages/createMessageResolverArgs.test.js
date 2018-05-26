import { expect } from 'chai'
import createMessageResolverArgs from './createMessageResolverArgs'

const originArgs = {
  value: 'foo',
  fieldProps: {},
  fields: {},
  form: {},
}

test('Creates a proper message resolver args', () => {
  const args = createMessageResolverArgs(originArgs, {})

  expect(args)
    .to.be.an('object')
    .that.has.all.keys(['value', 'fieldProps', 'fields', 'form'])
})

test('Propagates "extra" parameters', () => {
  const args = createMessageResolverArgs(originArgs, {
    extra: {
      foo: 'bar',
    },
  })

  expect(args)
    .to.be.an('object')
    .that.has.all.keys(['value', 'fieldProps', 'fields', 'form', 'foo'])
  expect(args).to.have.property('foo', 'bar')
})

test('Origin arguments have higher priority over extra props', () => {
  const args = createMessageResolverArgs(originArgs, {
    extra: {
      value: 'bar',
    },
  })

  expect(args)
    .to.be.an('object')
    .that.has.all.keys(['value', 'fieldProps', 'fields', 'form'])
  expect(args).to.have.property('value', 'foo')
})
