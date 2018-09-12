import React from 'react'
import Scenario, { timeoutDuration } from '@examples/validation/misc/AjaxPrefilling'

describe('AJAX Pre-filling', function() {
  before(() => {
    cy.loadStory(<Scenario />)
    cy.get('#ajax')
      .click()
      .wait(timeoutDuration)
  })

  it('Pre-fills value properly', () => {
    cy.getField('street')
      .hasValue('Baker')
      .expected()
  })

  it('Validates pre-filled value properly', () => {
    cy.getField('streetRule')
      .hasValue('Baker')
      .expected(false)
  })
})
