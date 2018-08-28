import { expect } from 'chai'
import makeCancelable from './makeCancelable'

test('Allows to cancel pending promise', () => {
  let num = 0
  const pendingPromise = makeCancelable(
    new Promise(() => {
      setTimeout(() => num++, 100)
    }),
  )

  expect(pendingPromise.itself).to.be.an.instanceOf(Promise)

  setTimeout(() => {
    pendingPromise.cancel()
  }, 50)

  setTimeout(() => {
    expect(num).to.equal(0)
  }, 110)
})
