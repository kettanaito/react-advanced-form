import React from 'react'
import Scenario from '@examples/basics/Reset'

const reset = () => {
  cy.get('button[type="reset"]').click()
}

describe('Reset', function() {
  before(() => {
    cy.loadStory(<Scenario getRef={(form) => (this.form = form)} />)

    cy.getField('username')
      .clear()
      .typeIn('john.doe')
      .expected()
    cy.getField('password')
      .clear()
      .typeIn('foo')
      .expected()
    cy.getField('termsAndConditions')
      .check({ force: true })
      .expected()

    reset()
  })

  it('Resets changed field to its initial value', () => {
    cy.getField('username')
      .hasValue('john.doe')
      .expected()
  })

  it('Does not validate reset empty field', () => {
    cy.getField('firstName')
      .hasValue('')
      .validated('sync', false)
      .validated('async', false)
      .valid(false)
      .invalid(false)
    cy.getField('password')
      .hasValue('')
      .valid(false)
      .invalid(false)
  })

  it('Has no effect over pristine field', () => {
    cy.getField('termsAndConditions')
      .should('not.be.checked')
      .valid(false)
      .invalid(false)
  })
})
