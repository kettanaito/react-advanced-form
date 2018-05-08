import { expect } from 'chai'
import { Map, Record } from 'immutable'
import * as recordUtils from './recordUtils'

const inputField = recordUtils.createField({
  name: 'fieldOne',
  value: 'foo',
})

const checkboxField = recordUtils.createField({
  name: 'checkboxOne',
  type: 'checkbox',
  checked: true,
})

describe('recordUtils', () => {
  it('createField', () => {
    expect(inputField).to.be.an.instanceOf(Record)
    expect(inputField.name).to.equal('fieldOne')
    expect(inputField.type).to.equal('text')
    expect(inputField.value).to.equal('foo')
    expect(inputField.initialValue).to.equal('foo')

    expect(checkboxField).to.be.an.instanceOf(Record)
    expect(checkboxField.name).to.equal('checkboxOne')
    expect(checkboxField.type).to.equal('checkbox')
    expect(checkboxField.checked).to.be.true
    expect(checkboxField.initialValue).to.be.true
  })

  it('updateCollectionWith', () => {
    const nextCollection = recordUtils.updateCollectionWith(inputField, Map())
    expect(nextCollection.getIn(inputField.fieldPath)).deep.equal(inputField)
  })

  it('getValue', () => {
    const value = recordUtils.getValue(inputField)
    expect(value).to.equal('foo')
    expect(inputField.value).to.equal('foo')
  })

  it('setValue', () => {
    const nextValue = 'bar'
    const nextRecord = recordUtils.setValue(inputField, nextValue)
    expect(nextRecord.value).to.equal(nextValue)
  })

  it('setFocus', () => {
    const focusedRecord = recordUtils.setFocus(inputField, true)
    expect(focusedRecord.focused).to.be.true

    const unfocusedRecord = recordUtils.setFocus(focusedRecord, false)
    expect(unfocusedRecord.focused).to.be.false
  })

  it('setErrors', () => {
    const errors = ['foo', 'bar']
    const nextRecord = recordUtils.setErrors(inputField, errors)
    expect(nextRecord.errors)
      .to.be.an.instanceOf(Array)
      .with.lengthOf(2)
      .that.deep.equals(errors)

    expect(recordUtils.setErrors(inputField, undefined).errors).to.be.null
  })

  it('reset', () => {
    const nextInput = recordUtils.setValue(inputField, 'bar')
    expect(nextInput.value).to.equal('bar')

    const resetInput = recordUtils.reset(nextInput)
    expect(resetInput.value).to.equal(resetInput.initialValue)
  })

  it('beginValidation', () => {
    const nextRecord = recordUtils.beginValidation(recordUtils.setErrors(inputField, ['foo']))

    expect(nextRecord.errors).to.be.null
  })

  it('resetValidityState', () => {
    const nextRecord = recordUtils.resetValidityState(
      inputField.set('valid', true).set('invalid', true),
    )

    expect(nextRecord.valid).to.be.false
    expect(nextRecord.invalid).to.be.false
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

    expect(nextRecord.validating).to.be.false
    expect(nextRecord.validated).to.be.false
    expect(nextRecord.validatedSync).to.be.false
    expect(nextRecord.validatedAsync).to.be.false
    expect(nextRecord.validSync).to.be.false
    expect(nextRecord.validAsync).to.be.false
  })
})
