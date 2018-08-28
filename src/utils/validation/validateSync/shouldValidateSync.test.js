import shouldValidateSync from './shouldValidateSync'
import * as recordUtils from '../../recordUtils'

test('returns "true" when validation is forced', () => {
  const needsValidation = shouldValidateSync(
    {
      fieldProps: recordUtils.createField({ name: 'fieldOne' }),
    },
    null,
    true,
  )

  expect(needsValidation).toEqual(true)
})

test('returns "true" for required field', () => {
  const needsValidation = shouldValidateSync(
    {
      fieldProps: recordUtils.createField({
        name: 'fieldOne',
        required: true,
      }),
    },
    null,
    false,
  )

  expect(needsValidation).toEqual(true)
})

test('returns "true" for non-validated field with value and field rule', () => {
  const needsValidation = shouldValidateSync(
    {
      fieldProps: recordUtils.createField({
        name: 'fieldOne',
        rule: /\d+/,
        value: 'foo',
      }),
    },
    null,
    false,
  )

  expect(needsValidation).toEqual(true)
})

test('returns "true" for non-validated field with value and form rules', () => {
  const needsValidation = shouldValidateSync(
    {
      fieldProps: recordUtils.createField({
        name: 'fieldOne',
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

test('returns "false" for empty optional field', () => {
  const needsValidation = shouldValidateSync(
    {
      fieldProps: recordUtils.createField({
        name: 'fieldOne',
        value: '',
      }),
    },
    null,
    false,
  )

  expect(needsValidation).toEqual(false)
})
