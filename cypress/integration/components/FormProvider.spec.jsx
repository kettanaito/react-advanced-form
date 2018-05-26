import React from 'react'
import Scenario from '@examples/components/FormProvider/DebounceTime'

describe('FormProvider', function() {
  before(() => {
    cy.loadStory(<Scenario />)
  })

  it('Propagates the default value of "debounceTime"', () => {
    cy
      .get('#fieldOne')
      .type('fo')
      .should('have.class', 'is-invalid')
      .type('o')
      .should('have.class', 'is-invalid')
      .wait(250)
      .should('have.class', 'is-valid')
  })

  it('Supports custom value of "debounceTime"', () => {
    cy
      .get('#fieldTwo')
      .type('fo')
      .should('have.class', 'is-invalid')
      .type('o')
      .wait(0)
      .should('not.have.class', 'is-invalid')
      .should('have.class', 'is-valid')
  })
})
