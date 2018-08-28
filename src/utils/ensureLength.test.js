import { expect } from 'chai'
import ensureLength from './ensureLength'

test('Prepends "null" until the length matches', () => {
  const arr = [1, 2]
  const withEnsuredLength = ensureLength(4)(arr)

  expect(withEnsuredLength)
    .to.be.an('array')
    .with.lengthOf(4)
    .that.deep.equals([null, null, 1, 2])
})

test('Bypasses arrays which satisfy minimum length', () => {
  const arr = [1, 2, 3]
  const withEnsuredLength = ensureLength(3)(arr)

  expect(withEnsuredLength)
    .to.be.an('array')
    .with.lengthOf(3)
    .that.deep.equals([1, 2, 3])
})
