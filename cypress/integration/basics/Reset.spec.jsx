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
      .typeIn('admin')
      .blur()
      .expected()
      .touched()
    cy.getField('password')
      .clear()
      .typeIn('foo')
      .blur()
      .expected()
      .touched()
    cy.getField('termsAndConditions')
      .markChecked()
      .expected()
      .touched()

    reset()
  })

  it('Resets changed field to its initial value', () => {
    cy.getField('username')
      .hasValue('john.doe')
      .expected()
      .touched(false)
  })

  it('Does not validate empty reset field', () => {
    cy.getField('firstName')
      .touched(false)
      .hasValue('')
      .validated('sync', false)
      .validated('async', false)
      .valid(false)
      .invalid(false)
    cy.getField('password')
      .touched(false)
      .hasValue('')
      .valid(false)
      .invalid(false)
  })

  it('Has no effect over pristine field', () => {
    cy.getField('termsAndConditions')
      .should('not.be.checked')
      .touched(false)
      .valid(false)
      .invalid(false)
  })
})
