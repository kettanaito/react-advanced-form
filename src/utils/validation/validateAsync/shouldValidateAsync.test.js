import shouldValidateAsync from './shouldValidateAsync'
import * as recordUtils from '../../recordUtils'

test('returns "true" for sync valid with "asyncRule"', () => {
  const needsValidation = shouldValidateAsync(
    {
      fieldProps: recordUtils.createField({
        name: 'fieldOne',
        asyncRule: () => true,
        validSync: true,
      }),
    },
    null,
  )

  expect(needsValidation).toEqual(true)
})

test('returns "false" for sync valid field without "asyncRule"', () => {
  const needsValidation = shouldValidateAsync(
    {
      fieldProps: recordUtils.createField({
        name: 'fieldOne',
        validSync: true,
      }),
    },
    null,
  )

  expect(needsValidation).toEqual(false)
})

test('retuns "false" for async valid field', () => {
  const needsValidation = shouldValidateAsync(
    {
      fieldProps: recordUtils.createField({
        name: 'fieldOne',
        asyncRule: () => true,
        validSync: true,
        validAsync: true,
      }),
    },
    null,
  )

  expect(needsValidation).toEqual(false)
})
