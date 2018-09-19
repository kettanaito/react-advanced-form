import { expect } from 'chai'
import camelize from './camelize'

test('Converts given strings to camelCase', () => {
  const res = camelize('camel', 'case', 'string')
  expect(res).to.equal('camelCaseString')
})

test('Returns a single string intact', () => {
  const res = camelize('single')
  expect(res).to.equal('single')
})
