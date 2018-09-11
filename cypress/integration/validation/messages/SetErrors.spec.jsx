import React from 'react'
import Scenario from '@examples/validation/messages/SetErrors'

const firstButtonClick = () => cy.get('#btn-first').click()
const secondButtonClick = () => cy.get('#btn-second').click()

describe('Form-wide errors', function() {
  before(() => {
    cy.loadStory(<Scenario getRef={(form) => (this.form = form)} />)
  })

  afterEach(() => {
    this.form.reset()
  })

  it('Sets error messages for fields using form ref', () => {
    firstButtonClick()

    cy.getField('fieldOne')
      .invalid()
      .hasError('foo')
    cy.getField('firstName')
      .invalid()
      .hasError('bar')
  })

  it('Preserves validity state when setting explicit "null"', () => {
    cy.getField('fieldOne')
      .typeIn('123')
      .blur()
      .valid()

    firstButtonClick()

    cy.getField('fieldOne')
      .invalid()
      .hasError('foo')

    secondButtonClick()

    cy.getField('fieldOne').valid()
    cy.getField('firstName').invalid()
  })
})
