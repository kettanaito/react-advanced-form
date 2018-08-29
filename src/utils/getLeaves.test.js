import getLeaves, { getLeavesWith } from './getLeaves'

test('Returns all leaves of the given object', () => {
  const res = getLeaves({
    a: 1,
    b: {
      c: 2,
      d: {
        e: 3,
      },
      f: 4,
    },
  })

  expect(res).toEqual([1, 2, 3, 4])
})
