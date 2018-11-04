import * as recordUtils from './recordUtils'
import flushFieldRefs from './flushFieldRefs'

const fieldOne = recordUtils.createField({
  name: 'fieldOne',
  fieldPath: ['fieldOne'],
  value: 'foo',
})

const fieldTwo = recordUtils.createField({
  name: 'fieldTwo',
  fieldGroup: ['groupTwo'],
  fieldPath: ['groupTwo', 'fieldTwo'],
  value: 'bar',
})

const fields = recordUtils.updateCollectionWith(
  fieldOne,
  recordUtils.updateCollectionWith(fieldTwo, {}),
)

const method = ({ value, get }) => {
  expect(value).toEqual('foo')
  expect(get).toBeInstanceOf(Function)

  const valueOne = get(['fieldOne', 'value'])
  const valueTwo = get(['groupTwo', 'fieldTwo', 'value'])

  return valueOne + valueTwo
}

const methodArgs = {
  fieldProps: fieldOne,
  fields,
  form: {
    state: {
      fields,
    },
    context: {},
  },
}

test('Returns proper collection of field refs', () => {
  const { refs } = flushFieldRefs(method, methodArgs)

  expect(refs).toEqual([
    ['fieldOne', 'value'],
    ['groupTwo', 'fieldTwo', 'value'],
  ])
})

test('Returns proper initial value', () => {
  const { initialValue } = flushFieldRefs(method, methodArgs)
  expect(initialValue).toEqual('foobar')
})
