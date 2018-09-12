import deriveDeepWith from './deriveDeepWith'

test('deriveDeepWith', () => {
  const res = deriveDeepWith(
    (k, l, r) => l * r.value,
    {
      fieldOne: 5,
      billingAddress: {
        firstName: 2,
      },
      fieldThree: null,
    },
    {
      fieldOne: { value: 5 },
      fieldTwo: { value: 8 },
      billingAddress: {
        firstName: { value: 3 },
      },
      fieldThree: { value: 5 },
    },
  )

  expect(res).toEqual({
    fieldOne: 25,
    billingAddress: {
      firstName: 6,
    },
    fieldThree: 0,
  })
})
