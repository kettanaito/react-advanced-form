import { expect } from 'chai'
import isset from './isset'

test('Returns "true" for set variable', () => {
  expect(isset(false)).to.be.true
  expect(isset(0)).to.be.true
  expect(isset('value')).to.be.true
  expect(isset([false, 0, 'value'])).to.be.true
  expect(isset({ a: false, b: 0, c: 'value' })).to.be.true
})

test('Returns "false" for unset variables', () => {
  expect(isset(null)).to.be.false
  expect(isset(undefined)).to.be.false
})
