import makeCancelable from './makeCancelable'

test('Supports canceling of a pending promise', () => {
  let num = 0
  const pendingPromise = makeCancelable(
    new Promise(() => {
      setTimeout(() => num++, 100)
    }),
  )

  expect(pendingPromise.itself).toBeInstanceOf(Promise)

  setTimeout(() => {
    pendingPromise.cancel()
  }, 50)

  setTimeout(() => {
    expect(num).toEqual(0)
  }, 110)
})
