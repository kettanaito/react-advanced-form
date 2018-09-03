import React from 'react'
import Scenario from '@examples/components/FormProvider/DebounceTime'
import { defaultDebounceTime } from '@lib/src/components/FormProvider'

describe('FormProvider', function() {
  before(() => {
    cy.loadStory(<Scenario />)
  })

  it('Propagates the default value of "debounceTime"', () => {
    cy.get('[name="fieldOne"]')
      .typeIn('fo')
      .wait(defaultDebounceTime)
      .expected(false)
      .type('o')
      .wait(defaultDebounceTime)
      .expected()
  })

  it('Supports custom value of "debounceTime"', () => {
    cy.get('[name="fieldTwo"]')
      .typeIn('fo')
      .expected(false)
      .type('o')
      .wait(0)
      .expected()
  })
})
