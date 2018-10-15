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
    cy.wait(50)
  })

  it('Sets error messages for fields', () => {
    cy.wait(100)
    firstButtonClick()
    cy.wait(100)

    cy.getField('fieldOne')
      .touched()
      .invalid()
      .hasError('foo')
    cy.getField('firstName')
      .touched()
      .invalid()
      .hasError('bar')
  })

  it('Preserves validity state when setting explicit "null"', () => {
    cy.getField('fieldOne')
      .touched(false)
      .typeIn('123')
      .blur()
      .touched()
      .valid()

    firstButtonClick()
    cy.getField('fieldOne')
      .touched()
      .invalid()
      .hasError('foo')

    secondButtonClick()
    cy.getField('fieldOne')
      .valid()
      .touched(false)
    cy.getField('firstName')
      .touched()
      .invalid()
  })
})
