import * as R from 'ramda'
import * as recordUtils from '../../recordUtils'
import createValidationResult from '../createValidationResult'
import createRejectedRule from '../createRejectedRule'
import getMessages from './getMessages'

const messagesSchema = {
  general: {
    missing: 'General missing',
    invalid: 'General invalid',
  },
  type: {
    email: {
      invalid: 'Invalid type message',
      rule: {
        customRule: 'Custom type rule message',
      },
    },
  },
  name: {
    fieldOne: {
      missing: 'Missing name message',
      invalid: 'Invalid name message',
      rule: {
        customRule: 'Custom name rule message',
      },
    },
  },
}

const fieldOne = recordUtils.createField({
  name: 'fieldOne',
  type: 'email',
  value: 'foo',
})

const resolverArgs = {
  fieldProps: fieldOne,
}

// ===========================================================================

test('Resolvers type-specific named rejected rules', () => {
  const rejectedRules = [
    createRejectedRule({
      selector: 'type',
      errorType: 'invalid',
      name: 'customRule',
    }),
  ]

  const namedRuleMessage = getMessages(
    createValidationResult(false, rejectedRules),
    resolverArgs,
    messagesSchema,
  )
  expect(namedRuleMessage).toEqual([
    R.path(['type', 'email', 'rule', 'customRule'], messagesSchema),
  ])

  const typeFallbackMessage = getMessages(
    createValidationResult(false, rejectedRules),
    resolverArgs,
    R.dissocPath(['type', 'email', 'rule'], messagesSchema),
  )
  expect(typeFallbackMessage).toEqual([
    R.path(['type', 'email', 'invalid'], messagesSchema),
  ])

  const generalFallbackMessage = getMessages(
    createValidationResult(false, rejectedRules),
    resolverArgs,
    R.dissocPath(['type'], messagesSchema),
  )
  expect(generalFallbackMessage).toEqual([
    R.path(['general', 'invalid'], messagesSchema),
  ])
})

// ===========================================================================

test('Multiple rejected rules of different resolvers length', () => {
  const multipleRejectedRules = [
    createRejectedRule({
      selector: 'name',
      errorType: 'invalid',
      name: 'customRule',
    }),
    createRejectedRule({
      errorType: 'invalid',
      selector: 'name',
    }),
  ]

  const messages = getMessages(
    createValidationResult(false, multipleRejectedRules),
    resolverArgs,
    messagesSchema,
  )

  expect(messages).toEqual([
    R.path(['name', 'fieldOne', 'rule', 'customRule'], messagesSchema),
  ])
})

// ===========================================================================

test('Resolvers name-specific named rejected rules', () => {
  const rejectedRules = [
    createRejectedRule({
      selector: 'name',
      errorType: 'invalid',
      name: 'customRule',
    }),
  ]

  const namedRuleMessage = getMessages(
    createValidationResult(false, rejectedRules),
    resolverArgs,
    messagesSchema,
  )
  expect(namedRuleMessage).toEqual([
    R.path(['name', 'fieldOne', 'rule', 'customRule'], messagesSchema),
  ])

  const nameFallbackMessage = getMessages(
    createValidationResult(false, rejectedRules),
    resolverArgs,
    R.dissocPath(['name', 'fieldOne', 'rule'], messagesSchema),
  )
  expect(nameFallbackMessage).toEqual([
    R.path(['name', 'fieldOne', 'invalid'], messagesSchema),
  ])

  const typeFallbackMessage = getMessages(
    createValidationResult(false, rejectedRules),
    resolverArgs,
    R.dissocPath(['name', 'fieldOne'], messagesSchema),
  )
  expect(typeFallbackMessage).toEqual([
    R.path(['type', 'email', 'invalid'], messagesSchema),
  ])

  const generalFallbackMessage = getMessages(
    createValidationResult(false, rejectedRules),
    resolverArgs,
    R.compose(
      R.dissoc('type'),
      R.dissoc('name'),
    )(messagesSchema),
  )

  expect(generalFallbackMessage).toEqual([
    R.path(['general', 'invalid'], messagesSchema),
  ])
})

test('Fallbacks to the general invalid message when no specific ones found', () => {
  const rejectedRules = [
    createRejectedRule({
      selector: 'type',
      errorType: 'invalid',
      name: 'customRule',
    }),
  ]

  const messages = getMessages(
    createValidationResult(false, rejectedRules),
    resolverArgs,
    R.compose(
      R.dissoc('type'),
      R.dissoc('name'),
    )(messagesSchema),
  )

  expect(messages).toEqual([R.path(['general', 'invalid'], messagesSchema)])
})

test('Fallbacks to the general missing message when no specific ones found', () => {
  const rejectedRules = [
    createRejectedRule({
      selector: 'type',
      errorType: 'missing',
      name: 'customRule',
    }),
  ]

  const messages = getMessages(
    createValidationResult(false, rejectedRules),
    resolverArgs,
    R.compose(
      R.dissoc('type'),
      R.dissoc('name'),
    )(messagesSchema),
  )

  expect(messages).toEqual([R.path(['general', 'missing'], messagesSchema)])
})
