import { Map, Record } from 'immutable'
import * as recordUtils from './recordUtils'

const inputField = recordUtils.createField({
  name: 'fieldOne',
  value: 'foo',
  valuePropName: 'value',
})

const checkboxField = recordUtils.createField({
  name: 'checkboxOne',
  type: 'checkbox',
  checked: true,
  valuePropName: 'checked',
})

describe('recordUtils', () => {
  it('createField', () => {
    expect(inputField).toBeInstanceOf(Record)
    expect(inputField.name).toEqual('fieldOne')
    expect(inputField.type).toEqual('text')
    expect(inputField.value).toEqual('foo')
    expect(inputField.initialValue).toEqual('foo')

    expect(checkboxField).toBeInstanceOf(Record)
    expect(checkboxField.name).toEqual('checkboxOne')
    expect(checkboxField.type).toEqual('checkbox')
    expect(checkboxField.checked).toEqual(true)
    expect(checkboxField.initialValue).toEqual(true)
  })

  it('updateCollectionWith', () => {
    const nextCollection = recordUtils.updateCollectionWith(inputField, Map())
    expect(nextCollection.getIn(inputField.fieldPath)).toEqual(inputField)
  })

  it('getValue', () => {
    const value = recordUtils.getValue(inputField)
    expect(value).toEqual('foo')
    expect(inputField.value).toEqual('foo')
  })

  it('setValue', () => {
    const nextValue = 'bar'
    const nextRecord = recordUtils.setValue(nextValue, inputField)
    expect(nextRecord.value).toEqual(nextValue)
  })

  it('setFocus', () => {
    const focusedRecord = recordUtils.setFocus(true, inputField)
    expect(focusedRecord.focused).toEqual(true)

    const unfocusedRecord = recordUtils.setFocus(false, focusedRecord)
    expect(unfocusedRecord.focused).toEqual(false)
  })

  it('setErrors', () => {
    const errors = ['foo', 'bar']
    const nextRecord = recordUtils.setErrors(errors, inputField)

    expect(nextRecord.errors).toBeInstanceOf(Array)
    expect(nextRecord.errors).toHaveLength(2)
    expect(nextRecord.errors).toEqual(errors)
    expect(recordUtils.setErrors(undefined, inputField).errors).toBeNull()
  })

  it('reset', () => {
    const nextInput = recordUtils.setValue('bar', inputField)
    expect(nextInput.value).toEqual('bar')

    const resetInput = recordUtils.reset(nextInput)
    expect(resetInput.value).toEqual(resetInput.initialValue)
  })

  it('resetValidityState', () => {
    const nextRecord = recordUtils.resetValidityState(
      inputField.set('valid', true).set('invalid', true),
    )

    expect(nextRecord.valid).toEqual(false)
    expect(nextRecord.invalid).toEqual(false)
  })

  it('resetValidationState', () => {
    const nextRecord = recordUtils.resetValidationState(
      inputField
        .set('validating', true)
        .set('validated', true)
        .set('validatedSync', true)
        .set('validatedAsync', true)
        .set('validSync', true)
        .set('validAsync', true),
    )

    expect(nextRecord.validating).toEqual(false)
    expect(nextRecord.validated).toEqual(false)
    expect(nextRecord.validatedSync).toEqual(false)
    expect(nextRecord.validatedAsync).toEqual(false)
    expect(nextRecord.validSync).toEqual(false)
    expect(nextRecord.validAsync).toEqual(false)
  })
})
