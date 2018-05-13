import { expect } from 'chai'
import shouldValidateAsync from './shouldValidateAsync'
import * as recordUtils from '../../recordUtils'

test('returns "true" when forced', () => {
  const needsValidation = shouldValidateAsync(null, true)
  expect(needsValidation).to.be.true
})

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

  expect(needsValidation).to.be.true
})

test('returns "false" for sync invalid field', () => {
  const needsValidation = shouldValidateAsync(
    {
      fieldProps: recordUtils.createField({
        name: 'fieldOne',
        asyncRule: () => true,
      }),
    },
    null,
  )

  expect(needsValidation).to.be.false
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

  expect(needsValidation).to.be.false
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

  expect(needsValidation).to.be.false
})
