import React from 'react'
import Scenario from '@examples/validation/misc/UI'
import { defaultDebounceTime } from '@lib/src/components/FormProvider'

describe('UI behavior', function() {
  before(() => {
    cy.loadStory(<Scenario />)
  })
  afterEach(() => {
    cy.get('[name="fieldOne"]').clear()
    cy.get('[name="fieldTwo"]').clear()
  })

  it('Reflects and persists valid field state', () => {
    cy
      .get('[name="fieldOne"]')
      .type('123')
      .wait(defaultDebounceTime)
      .should('not.have.class', 'is-invalid')
      .should('have.class', 'is-valid')
      .blur()
      .should('have.class', 'is-valid')
  })

  it('Reflects and persists invalid field state', () => {
    cy
      .get('[name="fieldOne"]')
      .type('foo')
      .wait(defaultDebounceTime)
      .should('not.have.class', 'is-valid')
      .should('have.class', 'is-invalid')
      .blur()
      .should('have.class', 'is-invalid')
  })

  it('Transitions from invalid to valid state', () => {
    cy
      .get('[name="fieldTwo"]')
      .type('foo')
      .wait(defaultDebounceTime)
      .should('have.class', 'is-invalid')
      .type('o')
      .wait(defaultDebounceTime)
      .should('have.class', 'is-valid')
      .should('not.have.class', 'is-invalid')
  })

  it('Transitions from valid to invalid state', () => {
    cy
      .get('[name="fieldTwo"]')
      .type('fooo')
      .wait(defaultDebounceTime)
      .should('have.class', 'is-valid')
      .type('{backspace}')
      .wait(defaultDebounceTime)
      .should('have.class', 'is-invalid')
      .should('not.have.class', 'is-valid')
  })

  it('Handles "validating" property', () => {
    cy
      .get('[name="fieldOne"]')
      .type('123')
      .should('have.class', 'is-validating')
      .wait(defaultDebounceTime)
      .should('not.have.class', 'is-validating')
  })
})
