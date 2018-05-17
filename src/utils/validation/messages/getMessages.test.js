import { expect } from 'chai'
import { fromJS } from 'immutable'
import * as recordUtils from '../../recordUtils'
import createRejectedRule from '../createRejectedRule'
import getMessages from './getMessages'

const messages = fromJS({
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

test('Has proper resolving sequence for type-specific named rules', () => {
  const rejectedRules = [
    createRejectedRule({
      selector: 'type',
      errorType: 'invalid',
      ruleName: 'customRule',
    }),
  ]

  const namedRuleMessage = getMessages(rejectedRules, resolverArgs, messages)
  expect(namedRuleMessage).to.deep.equal([
    messages.getIn(['type', 'email', 'rule', 'customRule']),
  ])

  const typeFallbackMessage = getMessages(
    rejectedRules,
    resolverArgs,
    messages.deleteIn(['type', 'email', 'rule']),
  )
  expect(typeFallbackMessage).to.deep.equal([
    messages.getIn(['type', 'email', 'invalid']),
  ])

  const generalFallbackMessage = getMessages(
    rejectedRules,
    resolverArgs,
    messages.deleteIn(['type']),
  )
  expect(generalFallbackMessage).to.deep.equal([
    messages.getIn(['general', 'invalid']),
  ])
})

// ========================================================================

test('Has proper resolving sequence for name-specific named rules', () => {
  const rejectedRules = [
    createRejectedRule({
      selector: 'name',
      errorType: 'invalid',
      ruleName: 'customRule',
    }),
  ]

  const namedRuleMessage = getMessages(rejectedRules, resolverArgs, messages)
  expect(namedRuleMessage).to.deep.equal([
    messages.getIn(['name', 'fieldOne', 'rule', 'customRule']),
  ])

  const nameFallbackMessage = getMessages(
    rejectedRules,
    resolverArgs,
    messages.deleteIn(['name', 'fieldOne', 'rule']),
  )
  expect(nameFallbackMessage).to.deep.equal([
    messages.getIn(['name', 'fieldOne', 'invalid']),
  ])

  const typeFallbackMessage = getMessages(
    rejectedRules,
    resolverArgs,
    messages.deleteIn(['name', 'fieldOne']),
  )
  expect(typeFallbackMessage).to.deep.equal([
    messages.getIn(['type', 'email', 'invalid']),
  ])

  const generalFallbackMessage = getMessages(
    rejectedRules,
    resolverArgs,
    messages.deleteIn(['name', 'fieldOne']).deleteIn(['type', 'email']),
  )
  expect(generalFallbackMessage).to.deep.equal([
    messages.getIn(['general', 'invalid']),
  ])
})

test('Fallbacks to the general message when no specific ones found', () => {})
