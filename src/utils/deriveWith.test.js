import deriveWith from './deriveWith'

test('deriveWith', () => {
  const res = deriveWith(
    (k, l, r) => l + r,
    { a: 2, b: 3, c: 0 },
    { a: 5, b: 4, d: 9 },
  )

  expect(res).toEqual({
    a: 7,
    b: 7,
  })
})
