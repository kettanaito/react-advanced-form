import { expect } from 'chai'
import addWhen from './addWhen'

const predicate = (num) => num

test('Propagates the return from "predicate" when it is satisfied', () => {
  const func = addWhen(predicate, (num) => {
    expect(num).to.equal(5)
    return num * 2
  })

  const res = func(5)
  expect(res).to.equal(10)
})

test('Omits function when "predicate" is unsatisfied', () => {
  const func = addWhen(predicate, (num) => {
    expect(num).to.be.false
    return num * 2
  })

  const res = func(false)
  expect(res).to.be.false
})
