import { expect } from 'chai'
import { Map } from 'immutable'
import * as recordUtils from '../recordUtils'
import createResolverArgs from './createResolverArgs'

const fieldProps = recordUtils.createField({ name: 'fieldOne' })
const checkbox = recordUtils.createField({
  name: 'checkbox',
  type: 'checkbox',
  checked: true,
  valuePropName: 'checked',
})
const fields = Map({ fieldOne: fieldProps })
const form = {}

test('Cannot be called without "fieldProps", "fields" and "form"', () => {
  expect(createResolverArgs).to.throw()
  expect(createResolverArgs.bind(this, {})).to.throw()
})

test('Adds property based on the field "valuePropName"', () => {
  expect(createResolverArgs({ fieldProps: checkbox, fields, form }))
    .to.be.an('object')
    .that.has.all.keys('get', 'checked', 'fieldProps', 'fields', 'form')
    .which.has.property('checked', true)
})

test('Adds "get" field props getter automatically', () => {
  expect(createResolverArgs({ fieldProps, fields, form }))
    .to.be.an('object')
    .that.has.all.keys('get', 'value', 'fieldProps', 'fields', 'form')
    .which.property('get')
    .is.a('function')
})

test('Omits unknown properties', () => {
  expect(createResolverArgs({ foo: 'bar', fieldProps, fields, form }))
    .to.be.an('object')
    .that.has.all.keys('get', 'value', 'fieldProps', 'fields', 'form')
})
