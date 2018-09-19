import shouldValidateSync from './shouldValidateSync'
import * as recordUtils from '../../recordUtils'

test('Returns "true" when validation is forced', () => {
  const needsValidation = shouldValidateSync(
    {
      fieldProps: recordUtils.createField({
        name: 'fieldOne',
        fieldPath: ['fieldOne'],
      }),
    },
    null,
    true,
  )

  expect(needsValidation).toEqual(true)
})

test('Returns "true" for required field', () => {
  const needsValidation = shouldValidateSync(
    {
      fieldProps: recordUtils.createField({
        name: 'fieldOne',
        fieldPath: ['fieldOne'],
        required: true,
      }),
    },
    null,
    false,
  )

  expect(needsValidation).toEqual(true)
})

test('Returns "true" for non-validated field with value and field rule', () => {
  const needsValidation = shouldValidateSync(
    {
      fieldProps: recordUtils.createField({
        name: 'fieldOne',
        fieldPath: ['fieldOne'],
        rule: /\d+/,
        value: 'foo',
      }),
    },
    null,
    false,
  )

  expect(needsValidation).toEqual(true)
})

test('Returns "true" for non-validated field with value and form rules', () => {
  const needsValidation = shouldValidateSync(
    {
      fieldProps: recordUtils.createField({
        name: 'fieldOne',
        fieldPath: ['fieldOne'],
        value: 'foo',
      }),
    },
    {
      type: [{}],
    },
    false,
  )

  expect(needsValidation).toEqual(true)
})

test('Returns "false" for empty optional field', () => {
  const needsValidation = shouldValidateSync(
    {
      fieldProps: recordUtils.createField({
        name: 'fieldOne',
        fieldPath: ['fieldOne'],
        value: '',
      }),
    },
    null,
    false,
  )

  expect(needsValidation).toEqual(false)
})
