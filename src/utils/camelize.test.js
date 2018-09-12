import { expect } from 'chai'
import camelize from './camelize'

test('Turns passed strings into camelCase', () => {
  const res = camelize('camel', 'case', 'string')
  expect(res).to.equal('camelCaseString')
})

test('Returns intact single string passed', () => {
  const res = camelize('single')
  expect(res).to.equal('single')
})
