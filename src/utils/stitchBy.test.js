import stitchBy from './stitchBy'

test('Stitches given list of objects into an object', () => {
  const res = stitchBy(
    ['k'],
    [
      {
        k: 'a',
        v: 1,
      },
      {
        k: ['b', 'c'],
        v: 2,
      },
      {
        k: ['b', 'c'],
        v: 3,
      },
    ],
  )

  expect(res).toEqual({
    a: [
      {
        k: 'a',
        v: 1,
      },
    ],
    b: {
      c: [
        {
          k: ['b', 'c'],
          v: 2,
        },
        {
          k: ['b', 'c'],
          v: 3,
        },
      ],
    },
  })
})
