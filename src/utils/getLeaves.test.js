import * as R from 'ramda'
import getLeavesWhich from './getLeaves'

// test('Returns all leaves of the given object', () => {
//   const res = getLeaves({
//     a: 1,
//     b: {
//       c: 2,
//       d: {
//         e: 3,
//       },
//       f: 4,
//     },
//   })

//   expect(res).toEqual([1, 2, 3, 4])
// })

test.only('getLeavesWhich', () => {
  const fields = {
    foo: {
      bar: 'doe',
    },
    fieldOne: {
      fieldPath: ['fieldOne'],
      value: 'foo',
    },
    groupName: {
      fieldTwo: {
        fieldPath: ['groupName', 'fieldTwo'],
        value: 'bar',
      },
      nestedGroupName: {
        fieldThree: {
          fieldPath: ['groupName', 'nestedGroupName', 'fieldThree'],
          value: 'doe',
        },
      },
    },
  }

  const getNestedFields = getLeavesWhich(R.has('fieldPath'))
  const res = getNestedFields(fields)

  console.log(res)

  expect(res).toEqual([
    fields.fieldOne,
    fields.groupName.fieldTwo,
    fields.groupName.nestedGroupName.fieldThree,
  ])
})
