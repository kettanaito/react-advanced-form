import * as R from 'ramda'
import stitchWith from './stitchWith'

test('Stitches the given list into an object', () => {
  const fieldOne = {
    name: 'fieldOne',
    fieldPath: ['fieldOne'],
    value: 1,
  }

  const fieldTwo = {
    name: 'fieldTwo',
    fieldPath: ['groupName', 'fieldTwo'],
    value: 2,
  }

  const fieldThree = {
    name: 'fieldTwo',
    fieldPath: ['groupName', 'fieldThree'],
    value: 2,
  }

  const res = stitchWith(R.prop('fieldPath'), R.identity, [
    fieldOne,
    fieldTwo,
    fieldThree,
  ])

  expect(res).toEqual({
    fieldOne,
    groupName: {
      fieldTwo,
      fieldThree,
    },
  })
})

test('Stitches the given list using custom needle function', () => {
  const res = stitchWith(
    R.prop('k'),
    (entry, keyPath, acc) => R.append(entry, R.pathOr([], keyPath, acc)),
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
