import React from 'react'
import Scenario, {
  timeoutDuration,
} from '@examples/validation/misc/AjaxPrefilling'

describe('AJAX Pre-filling', function() {
  before(() => {
    cy.loadStory(<Scenario />)
    cy
      .get('#ajax')
      .click()
      .wait(timeoutDuration)
  })

  it('Pre-fills value properly', () => {
    cy
      .getField('street')
      .should('have.value', 'Baker')
      .valid()
  })

  it('Validates pre-filled value properly', () => {
    cy
      .getField('streetRule')
      .should('have.value', 'Baker')
      .valid(false)
  })
})
