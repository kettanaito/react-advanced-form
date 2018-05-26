import { expect } from 'chai'
import { fromJS } from 'immutable'
import * as recordUtils from '../../recordUtils'
import createValidationResult from '../createValidationResult'
import createRejectedRule from '../createRejectedRule'
import getMessages from './getMessages'

const messagesSchema = fromJS({
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
})

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
      ruleName: 'customRule',
    }),
  ]

  const namedRuleMessage = getMessages(
    createValidationResult(false, rejectedRules),
    resolverArgs,
    messagesSchema,
  )
  expect(namedRuleMessage).to.deep.equal([
    messagesSchema.getIn(['type', 'email', 'rule', 'customRule']),
  ])

  const typeFallbackMessage = getMessages(
    createValidationResult(false, rejectedRules),
    resolverArgs,
    messagesSchema.deleteIn(['type', 'email', 'rule']),
  )
  expect(typeFallbackMessage).to.deep.equal([
    messagesSchema.getIn(['type', 'email', 'invalid']),
  ])

  const generalFallbackMessage = getMessages(
    createValidationResult(false, rejectedRules),
    resolverArgs,
    messagesSchema.deleteIn(['type']),
  )
  expect(generalFallbackMessage).to.deep.equal([
    messagesSchema.getIn(['general', 'invalid']),
  ])
})

// ===========================================================================

test('Multiple rejected rules of different resolvers length', () => {
  const multipleRejectedRules = [
    createRejectedRule({
      errorType: 'invalid',
      selector: 'name',
      ruleName: 'customRule',
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

  expect(messages).to.deep.equal([
    messagesSchema.getIn(['name', 'fieldOne', 'rule', 'customRule']),
  ])
})

// ===========================================================================

test('Resolvers name-specific named rejected rules', () => {
  const rejectedRules = [
    createRejectedRule({
      selector: 'name',
      errorType: 'invalid',
      ruleName: 'customRule',
    }),
  ]

  const namedRuleMessage = getMessages(
    createValidationResult(false, rejectedRules),
    resolverArgs,
    messagesSchema,
  )
  expect(namedRuleMessage).to.deep.equal([
    messagesSchema.getIn(['name', 'fieldOne', 'rule', 'customRule']),
  ])

  const nameFallbackMessage = getMessages(
    createValidationResult(false, rejectedRules),
    resolverArgs,
    messagesSchema.deleteIn(['name', 'fieldOne', 'rule']),
  )
  expect(nameFallbackMessage).to.deep.equal([
    messagesSchema.getIn(['name', 'fieldOne', 'invalid']),
  ])

  const typeFallbackMessage = getMessages(
    createValidationResult(false, rejectedRules),
    resolverArgs,
    messagesSchema.deleteIn(['name', 'fieldOne']),
  )
  expect(typeFallbackMessage).to.deep.equal([
    messagesSchema.getIn(['type', 'email', 'invalid']),
  ])

  const generalFallbackMessage = getMessages(
    createValidationResult(false, rejectedRules),
    resolverArgs,
    messagesSchema.deleteIn(['name', 'fieldOne']).deleteIn(['type', 'email']),
  )
  expect(generalFallbackMessage).to.deep.equal([
    messagesSchema.getIn(['general', 'invalid']),
  ])
})

// test('Fallbacks to the general message when no specific ones found', () => {})
