import { expect } from 'chai'
import enforceArray from './enforceArray'

test('Converts non-array into array', () => {
  const res = enforceArray('value')
  expect(res)
    .to.be.an.instanceOf(Array)
    .that.deep.equals(['value'])
})

test('Bypasses array passed as an argument', () => {
  const res = enforceArray(['value'])
  expect(res)
    .to.be.an.instanceOf(Array)
    .that.deep.equals(['value'])
})
