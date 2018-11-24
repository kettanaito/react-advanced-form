import * as recordUtils from './recordUtils'
import validateSync from './validation/validateSync'
import createRuleResolverArgs from './validation/createRuleResolverArgs'
import reduceWhile, { reduceWhileExpected } from './reduceWhile'

test('Reduces the list while predicate returns true', (done) => {
  const numbers = [2, 3, 4, 5]
  const lessThanTen = (acc) => acc < 10
  const reduceNumbers = reduceWhile(
    lessThanTen,
    (acc, number, externalNumber) => {
      return acc + number + externalNumber
    },
    0,
    numbers,
  )

  reduceNumbers(2).then((res) => {
    expect(res).toBe(15)
    done()
  })
})

test('Reduces validators while they resolve to expected', (done) => {
  const validatorsList = [validateSync]
  const fieldProps = recordUtils.createField({
    name: 'fieldOne',
    type: 'text',
    fieldPath: ['fieldOne'],
    value: 'foo',
  })
  const resolverArgs = createRuleResolverArgs({
    fieldProps,
    form: {
      state: {
        applicableRules: {
          type: {
            text: [
              {
                keyPath: ['type', 'text'],
                selector: 'type',
                resolver: ({ value }) => value !== 'foo',
              },
            ],
          },
          name: {
            fieldOne: [
              {
                keyPath: ['name', 'fieldOne'],
                selector: 'name',
                resolver: ({ value }) => value.length > 2,
              },
            ],
          },
        },
      },
    },
  })

  const validate = reduceWhileExpected(validatorsList)

  validate(resolverArgs).then((res) => {
    expect(res).toEqual({
      expected: false,
      validators: ['sync'],
      rejectedRules: [
        {
          selector: 'type',
          errorType: 'invalid',
        },
      ],
    })
    done()
  })
})
