import { expect } from 'chai'
import { Map } from 'immutable'
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
  recordUtils.updateCollectionWith(fieldTwo, Map()),
)

const method = ({ a, get }) => {
  expect(a).to.equal('value')
  expect(get).to.be.an.instanceOf(Function)

  const valueOne = get(['fieldOne', 'value'])
  const valueTwo = get(['groupTwo', 'fieldTwo', 'value'])

  return valueOne + valueTwo
}

const methodArgs = {
  a: 'value',
  fields,
  form: {
    context: {},
  },
}

test('Returns proper collection of field refs', () => {
  const { refs } = flushFieldRefs(method, methodArgs)

  expect(refs)
    .to.be.an.instanceOf(Array)
    .with.lengthOf(2)
    .that.deep.equals([
      ['fieldOne', 'value'],
      ['groupTwo', 'fieldTwo', 'value'],
    ])
})

test('Returns proper initial value', () => {
  const { initialValue } = flushFieldRefs(method, methodArgs)
  expect(initialValue).to.equal('foobar')
})
