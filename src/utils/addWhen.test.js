import { expect } from 'chai'
import isset from './isset'
import addWhen from './addWhen'

test('Propagates the given source to the function when predicate resolves', () => {
  const func = addWhen(5, isset, (num) => {
    expect(num).to.equal(5)
    return num * 2
  })

  const res = func()
  expect(res).to.equal(10)
})

test('Omits function call when predicate is rejected', () => {
  const func = addWhen(null, isset, (num) => {
    throw new Error('I should not be called!')
  })

  func()
})
