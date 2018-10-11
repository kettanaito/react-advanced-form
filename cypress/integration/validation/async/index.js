import React from 'react'
import Scenario from '@examples/validation/async/Field.props.asyncRule'

describe('Asynchronous validation', function() {
  before(() => {
    cy.loadStory(<Scenario getRef={(form) => (this.form = form)} />)
  })

  afterEach(() => {
    this.form.reset()
    cy.wait(50)
  })

  it('Bypasses async validation for empty optional field with async rule', () => {
    cy.getField('fieldOne')
      .focus()
      .blur({ force: true })
      .should('not.have.class', 'is-valid')
      .should('not.have.class', 'is-invalid')
  })

  it('Rejects empty required field with unsatisfied async rule', () => {
    cy.getField('fieldTwo')
      .focus()
      .blur({ force: true })
      .expected(false)
  })

  it('Resolves field that satisfies async rule', () => {
    cy.getField('fieldOne')
      .typeIn('expected value')
      .blur({ force: true })
      // .validating()
      .wait(500)
      // .validating(false)
      .expected()
  })

  it('Rejects field that does not satisfy async rule', () => {
    cy.getField('fieldOne')
      .typeIn('foo')
      .blur({ force: true })
      // .validating()
      .wait(500)
      // .validating(false)
      .expected(false)
  })

  it('Cancels pending async validation on field change', () => {
    cy.getField('fieldFour')
      .typeIn('foo')
      .blur({ force: true })
      // .validating()
      .wait(200)
      .clear()
      .typeIn('bar')
      // .validating(false)
      .wait(300)
      .should('not.have.class', 'is-invalid')
      .blur({ force: true })
      // .validating()
      .wait(500)
      // .validating(false)
      .expected()
  })
})
