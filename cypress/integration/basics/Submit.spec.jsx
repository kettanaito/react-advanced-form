import React from 'react'
import { expect } from 'chai'
import Scenario from '@examples/basics/Submit'

describe('Submit', function() {
  let submitCount = 0

  before(() => {
    cy.loadStory(<Scenario onSubmitStart={() => submitCount++} />)
  })

  it('Prevents form submit unless all fields are expected', () => {
    cy.wait(20)
    cy.get('button[type="submit"]').click()
    cy.get('[name="email"]').valid(false)
    cy.get('[name="password"]').valid(false)
    cy.get('[name="termsAndConditions"]').valid(false)
    expect(submitCount).to.equal(0)

    cy
      .get('[name="email"]')
      .type(' foo') // FIXME Cypress omits the first character due to whatever reason
      .valid()

    cy.get('button[type="submit"]').click()
    cy.get('[name="password"]').valid(false)
    cy.get('[name="termsAndConditions"]').valid(false)
    expect(submitCount).to.equal(0)

    cy
      .get('[name="password"]')
      .typeIn('bar')
      .valid()
    cy.get('button[type="submit"]').click()
    cy.get('[name="termsAndConditions"]').valid(false)
    expect(submitCount).to.equal(0)

    cy
      .get('[name="termsAndConditions"]')
      .check({ force: true })
      .should('be.checked')
      .blur()
      .valid()

    cy
      .get('button[type="submit"]')
      .click()
      .then(() => {
        expect(submitCount).to.equal(1)
      })
  })
})
