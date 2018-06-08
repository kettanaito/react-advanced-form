import React from 'react'
import Scenario from '@examples/validation/misc/UI'
import { defaultDebounceTime } from '@lib/src/components/FormProvider'

describe('UI behavior', function() {
  before(() => {
    cy.loadStory(<Scenario />)
  })
  afterEach(() => {
    cy.get('[name="fieldOne"]').clear()
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
})
