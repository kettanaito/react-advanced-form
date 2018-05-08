import { expect } from 'chai'
import createSeq from './createSeq'

test('Executes the entire chain of functions by default', () => {
  let num = 0
  const seq = createSeq()
  const res = seq(() => (num += 1), () => (num += 2), () => (num += 3))()

  expect(num).to.equal(6)
})

test('Executes the chain of functions while result satisfies predicate', () => {
  let num = 0
  const seq = createSeq((value) => value < 4)
  const res = seq(() => (num += 2), () => (num += 2), () => (num += 10))()

  expect(num).to.equal(4)
})
