import { expect } from 'chai'
import createRejectedRule from './createRejectedRule'

test('Propagates given properties properly', () => {
  const rejectedRule = createRejectedRule({
    errorType: 'async',
    ruleKeyPath: ['name', 'fieldOne'],
    isCustom: true,
  })

  expect(rejectedRule)
    .to.be.an('object')
    .that.has.all.keys('errorType', 'ruleKeyPath', 'isCustom')
  expect(rejectedRule).to.have.property('errorType', 'async')
  expect(rejectedRule)
    .to.have.property('ruleKeyPath')
    .that.deep.equals(['name', 'fieldOne'])
  expect(rejectedRule).to.have.property('isCustom', true)
})

test('Sets "isCustom" to "false" by default', () => {
  const rejectedRule = createRejectedRule({ errorType: 'missing' })
  expect(rejectedRule)
    .to.be.an('object')
    .that.has.all.keys('errorType', 'ruleKeyPath', 'isCustom')
    .which.has.property('isCustom', false)
})
