import { expect } from 'chai'
import * as recordUtils from '../recordUtils'
import createRuleResolverArgs from './createRuleResolverArgs'

const fieldProps = recordUtils.createField({ name: 'fieldOne' })
const checkbox = recordUtils.createField({
  name: 'checkbox',
  type: 'checkbox',
  checked: true,
  valuePropName: 'checked',
})
const fields = { fieldOne: fieldProps }
const form = {}

test('Throws on call attempt without "fieldProps" and "form"', () => {
  expect(createRuleResolverArgs).to.throw()
  expect(createRuleResolverArgs.bind(this, {})).to.throw()
})

test('Adds property based on the field "valuePropName"', () => {
  expect(createRuleResolverArgs({ fieldProps: checkbox, fields, form }))
    .to.be.an('object')
    .that.has.all.keys('get', 'checked', 'fieldProps', 'fields', 'form')
    .which.has.property('checked', true)
})

test('Adds "get" field props getter automatically', () => {
  expect(createRuleResolverArgs({ fieldProps, fields, form }))
    .to.be.an('object')
    .that.has.all.keys('get', 'value', 'fieldProps', 'fields', 'form')
    .which.property('get')
    .is.a('function')
})

test('Omits unknown properties', () => {
  expect(createRuleResolverArgs({ foo: 'bar', fieldProps, fields, form }))
    .to.be.an('object')
    .that.has.all.keys('get', 'value', 'fieldProps', 'fields', 'form')
})
