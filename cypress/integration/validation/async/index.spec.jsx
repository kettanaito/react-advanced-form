import React from 'react'
import Scenario from '@examples/validation/async/Field.props.asyncRule'

describe('Asynchronous validation', function() {
  before(() => {
    cy.loadStory(<Scenario getRef={(form) => (this.form = form)} />)
  })

  afterEach(() => {
    this.form.reset()
  })

  describe('Logic', () => {
    it('Resolves empty optional field with satisfied async rule', () => {
      cy
        .getField('fieldOne')
        .focus()
        .blur({ force: true })
        .should('not.have.class', 'is-valid')
        .should('not.have.class', 'is-invalid')
    })

    it('Rejects empty required field with unsatisfied async rule', () => {
      cy
        .getField('fieldTwo')
        .focus()
        .blur({ force: true })
        .valid(false)
    })

    it('Resolves field with the expected value', () => {
      cy
        .getField('fieldOne')
        .typeIn('expected value')
        .blur({ force: true })
        .validating()
        .wait(500)
        .validating(false)
        .valid(false)
    })

    it('Rejects field with the unexpected value', () => {
      cy
        .getField('fieldOne')
        .typeIn('foo')
        .blur({ force: true })
        .validating()
        .wait(500)
        .validating(false)
        .valid(false)
    })

    it('Cancels pending async validation on field change', () => {
      cy
        .getField('fieldOne')
        .typeIn('foo')
        .blur({ force: true })
        .validating()
        .wait(200)
        .clear()
        .validating(false)
        .should('not.have.class', 'is-invalid')
        .typeIn('expected value')
        .blur({ force: true })
        .validating()
        .wait(500)
        .validating(false)
        .valid()
    })
  })
})
