import shouldValidateAsync from './shouldValidateAsync'
import * as recordUtils from '../../recordUtils'

test('Returns "true" for sync valid with asyncRule', () => {
  const needsValidation = shouldValidateAsync(
    {
      fieldProps: recordUtils.createField({
        name: 'fieldOne',
        fieldPath: ['fieldOne'],
        value: 'foo',
        asyncRule: () => true,
        validatedSync: true,
        validSync: true,
      }),
    },
    null,
  )

  expect(needsValidation).toEqual(true)
})

test('Returns "false" for empty field with asyncRule', () => {
  const needsValidation = shouldValidateAsync(
    {
      fieldProps: recordUtils.createField({
        name: 'fieldOne',
        fieldPath: ['fieldOne'],
        value: '',
        asyncRule: () => true,
      }),
    },
    null,
  )

  expect(needsValidation).toEqual(false)
})

test('Returns "false" for sync valid field without asyncRule', () => {
  const needsValidation = shouldValidateAsync(
    {
      fieldProps: recordUtils.createField({
        name: 'fieldOne',
        fieldPath: ['fieldOne'],
        value: 'foo',
        validSync: true,
      }),
    },
    null,
  )

  expect(needsValidation).toEqual(false)
})

test('Returns "false" for sync invalid field with asyncRule', () => {
  const needsValidation = shouldValidateAsync({
    fieldProps: recordUtils.createField({
      name: 'fieldOne',
      fieldPath: ['fieldOne'],
      value: 'foo',
      asyncRule: () => true,
      validatedSync: true,
      validSync: false,
    }),
  })

  expect(needsValidation).toEqual(false)
})

test('Retuns "false" for async valid field', () => {
  const needsValidation = shouldValidateAsync(
    {
      fieldProps: recordUtils.createField({
        name: 'fieldOne',
        fieldPath: ['fieldOne'],
        value: 'foo',
        asyncRule: () => true,
        validSync: true,
        validAsync: true,
      }),
    },
    null,
  )

  expect(needsValidation).toEqual(false)
})
