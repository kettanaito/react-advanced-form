import { expect } from 'chai'
import createRejectedRule from './createRejectedRule'
import createValidationResult from './createValidationResult'

test('Creates vaildation result with a single "expected" argument given', () => {
  const validationResult = createValidationResult(true)

  expect(validationResult)
    .to.be.an('object')
    .that.has.all.keys('expected', 'rejectedRules', 'extra')
  expect(validationResult).to.have.property('expected', true)
  expect(validationResult).to.have.property('rejectedRules', undefined)
  expect(validationResult).to.have.property('extra', undefined)
})

test('Forces "rejectedRules" to be an Array', () => {
  const rejectedRule = createRejectedRule({
    errorType: 'invalid',
    ruleKeyPath: ['text', 'type'],
  })
  const validationResult = createValidationResult(false, rejectedRule)

  expect(validationResult).to.have.property('expected', false)
  expect(validationResult)
    .to.have.property('rejectedRules')
    .that.is.an('array')
    .that.deep.equals([rejectedRule])
})

test('Accepts Array of rejected rules', () => {
  const rejectedRuleOne = createRejectedRule({ errorType: 'missing' })
  const rejectedRuleTwo = createRejectedRule({ invalid: 'missing' })
  const validationResult = createValidationResult(false, [
    rejectedRuleOne,
    rejectedRuleTwo,
  ])

  expect(validationResult).to.have.property('expected', false)
  expect(validationResult)
    .to.have.property('rejectedRules')
    .that.is.an('array')
    .that.deep.equals([rejectedRuleOne, rejectedRuleTwo])
})

test('Propagates given "extra" properties', () => {
  const validationResult = createValidationResult(false, null, { foo: 'bar' })

  expect(validationResult).to.have.property('expected', false)
  expect(validationResult).to.have.property('rejectedRules', null)
  expect(validationResult)
    .to.have.property('extra')
    .that.deep.equals({ foo: 'bar' })
})
