import * as R from 'ramda'
import * as recordUtils from './recordUtils'

const inputField = recordUtils.createField({
  name: 'fieldOne',
  fieldPath: ['fieldOne'],
  type: 'text',
  value: 'foo',
})

const checkboxField = recordUtils.createField({
  name: 'checkboxOne',
  fieldPath: ['checkboxOne'],
  type: 'checkbox',
  checked: true,
  valuePropName: 'checked',
})

describe('recordUtils', () => {
  it('createField', () => {
    expect(inputField).toBeInstanceOf(Object)
    expect(inputField).toHaveProperty('name', 'fieldOne')
    expect(inputField).toHaveProperty('type', 'text')
    expect(inputField).toHaveProperty('value', 'foo')
    expect(inputField).toHaveProperty('valuePropName', 'value')
    expect(inputField).toHaveProperty('initialValue', 'foo')
    expect(inputField).toHaveProperty('touched', false)
    expect(inputField).toHaveProperty('pristine', true)

    expect(checkboxField).toBeInstanceOf(Object)
    expect(checkboxField).toHaveProperty('name', 'checkboxOne')
    expect(checkboxField).toHaveProperty('type', 'checkbox')
    expect(checkboxField).toHaveProperty('checked', true)
    expect(checkboxField).toHaveProperty('initialValue', true)
    expect(checkboxField).toHaveProperty('touched', false)
    expect(checkboxField).toHaveProperty('pristine', true)
  })

  it('New fields are not touched by default', () => {
    expect(inputField).toHaveProperty('touched', false)
    expect(checkboxField).toHaveProperty('touched', false)
  })

  it('getValue', () => {
    const value = recordUtils.getValue(inputField)
    expect(value).toEqual('foo')
    expect(inputField).toHaveProperty('value', 'foo')
  })

  it('setValue', () => {
    const nextValue = 'bar'
    const nextRecord = recordUtils.setValue(nextValue, inputField, {})
    expect(nextRecord).toHaveProperty('value', nextValue)
  })

  it('setFocus', () => {
    const focusedRecord = recordUtils.setFocused(true, inputField)
    expect(focusedRecord).toHaveProperty('focused', true)

    const unfocusedRecord = recordUtils.setFocused(false, focusedRecord)
    expect(unfocusedRecord).toHaveProperty('focused', false)
  })

  it('setErrors', () => {
    const errors = ['foo', 'bar']
    const nextRecord = recordUtils.setErrors(errors, {})

    expect(nextRecord.errors).toBeInstanceOf(Array)
    expect(nextRecord.errors).toHaveLength(2)
    expect(nextRecord.errors).toEqual(errors)
    expect(recordUtils.setErrors(undefined, { errors: null })).toHaveProperty(
      'errors',
      null,
    )
  })

  it('reset', () => {
    const nextInput = R.mergeDeepLeft(
      recordUtils.setValue('bar', inputField, {}),
      inputField,
    )
    expect(nextInput).toHaveProperty('value', 'bar')

    const resetInput = R.mergeDeepLeft(
      recordUtils.reset(R.prop('initialValue'), nextInput),
      nextInput,
    )
    expect(resetInput).toHaveProperty('value', resetInput.initialValue)
  })

  it('resetValidityState', () => {
    const nextRecord = recordUtils.resetValidityState(
      R.compose(
        R.assoc('valid', true),
        R.assoc('invalid', true),
      )(inputField),
    )

    expect(nextRecord).toHaveProperty('valid', false)
    expect(nextRecord).toHaveProperty('invalid', false)
  })

  it('resetValidationState', () => {
    const nextRecord = recordUtils.resetValidationState(
      R.compose(
        R.assoc('validating', true),
        R.assoc('validated', true),
        R.assoc('validatedSync', true),
        R.assoc('validatedAsync', true),
        R.assoc('validSync', true),
        R.assoc('validAsync', true),
      )(inputField),
    )

    expect(nextRecord).toHaveProperty('validating', false)
    expect(nextRecord).toHaveProperty('validated', false)
    expect(nextRecord).toHaveProperty('validatedSync', false)
    expect(nextRecord).toHaveProperty('validatedAsync', false)
    expect(nextRecord).toHaveProperty('validSync', false)
    expect(nextRecord).toHaveProperty('validAsync', false)
  })

  it('updateValidityState: Resolves idle', () => {
    const nextState = recordUtils.updateValidityState(
      {
        ...inputField,
        value: '',
      },
      {
        validated: false,
        expected: true,
      },
    )

    expect(nextState).toHaveProperty('valid', false)
    expect(nextState).toHaveProperty('invalid', false)
  })

  it('updateValidityState: Resolves on expected value', () => {
    const nextState = recordUtils.updateValidityState(
      {
        ...inputField,
        value: 'foo',
      },
      {
        validated: true,
        expected: true,
      },
    )

    expect(nextState).toHaveProperty('valid', true)
    expect(nextState).toHaveProperty('invalid', false)
  })

  it('updateValidityState: Rejects on unexpected value', () => {
    const nextState = recordUtils.updateValidityState(
      {
        ...inputField,
        value: 'foo',
      },
      {
        validated: true,
        expected: false,
      },
    )

    expect(nextState).toHaveProperty('valid', false)
    expect(nextState).toHaveProperty('invalid', true)
  })

  it('setTouched', () => {
    const nextState = recordUtils.setTouched(true, inputField)
    expect(nextState).toHaveProperty('touched', true)
  })

  it('setPristine', () => {
    const nextFieldState = recordUtils.setPristine(false, inputField)
    expect(nextFieldState).toHaveProperty('pristine', false)
  })
})
