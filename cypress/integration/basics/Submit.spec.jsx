import React from 'react'
import { expect } from 'chai'
import SubmitScenario from '@examples/basics/Submit'

describe('Submit', function() {
  let submitCount = 0

  before(() => {
    cy.loadStory(<SubmitScenario onSubmitStart={() => submitCount++} />)
  })

  it('Prevents form submit until all fields are expected', () => {
    cy.get('button[type="submit"]').click()
    cy.get('[name="email"]').should('have.class', 'is-invalid')
    cy.get('[name="password"]').should('have.class', 'is-invalid')
    cy.get('[name="termsAndConditions"]').should('have.class', 'is-invalid')
    expect(submitCount).to.equal(0)

    cy
      .get('[name="email"]')
      .type('foo')
      .should('have.value', 'foo')
      .should('have.class', 'is-valid')

    cy.get('button[type="submit"]').click()
    cy.get('[name="password"]').should('have.class', 'is-invalid')
    cy.get('[name="termsAndConditions"]').should('have.class', 'is-invalid')
    expect(submitCount).to.equal(0)

    cy
      .get('[name="password"]')
      .type('bar')
      .should('have.value', 'bar')
      .should('have.class', 'is-valid')
    cy.get('button[type="submit"]').click()
    cy.get('[name="termsAndConditions"]').should('have.class', 'is-invalid')
    expect(submitCount).to.equal(0)

    cy
      .get('[name="termsAndConditions"]')
      .check({ force: true })
      .should('be.checked')
      .blur()
      .should('have.class', 'is-valid')

    cy
      .get('button[type="submit"]')
      .click()
      .then(() => {
        expect(submitCount).to.equal(1)
      })
  })
})
