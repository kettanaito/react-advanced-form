import { expect } from 'chai'
import listOf from './listOf'

test('Populates an array with existing function results', () => {
  const populate = listOf(
    (arg) => {
      expect(arg).to.equal('foo')
      return 1
    },
    (arg) => {
      expect(arg).to.equal('foo')
      return null
    },
    (arg) => {
      expect(arg).to.equal('foo')
      return 2
    },
    (arg) => {
      expect(arg).to.equal('foo')
      return undefined
    },
  )
  expect(populate('foo')).to.deep.equal([1, 2])
})
