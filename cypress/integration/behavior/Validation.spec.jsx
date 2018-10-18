import React from 'react'
import Scenario from '@examples/validation/misc/UI'
import { defaultDebounceTime } from '@root/src/components/FormProvider'

describe('Validation', function() {
  before(() => {
    cy._loadStory(['Behavior', 'Validation UI'])
  })

  afterEach(() => {
    cy.getField('fieldOne').clear()
    cy.getField('fieldTwo').clear()
  })

  it('Reflects and persists valid field state', () => {
    cy.getField('fieldOne')
      .typeIn('123')
      .wait(defaultDebounceTime)
      .validSync()
      .blur()
      .validSync()
  })

  it('Reflects and persists invalid field state', () => {
    cy.getField('fieldOne')
      .typeIn('foo')
      .wait(defaultDebounceTime)
      .validSync(false)
      .blur()
      .validSync(false)
  })

  it('Transitions from invalid to valid state', () => {
    cy.getField('fieldTwo')
      .typeIn('som')
      .wait(defaultDebounceTime)
      .validSync(false)
      .type('e')
      .wait(defaultDebounceTime)
      .validSync()
  })

  it('Transitions from valid to invalid state', () => {
    cy.getField('fieldTwo')
      .typeIn('some')
      .wait(defaultDebounceTime)
      .validSync()
      .type('{backspace}')
      .wait(defaultDebounceTime)
      .validSync(false)
  })
})
