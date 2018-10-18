import React from 'react'
import Scenario from '@examples/validation/misc/UI'

describe('Touched', () => {
  before(() => {
    cy.loadStory(<Scenario />)
  })

  it('Asserts a field is untouched by default', () => {
    cy.getField('fieldOne')
      .touched(false)
      .focus()
      .touched(false)
      .blur()
  })

  it('A field becomes touched after focus and blur', () => {
    cy.getField('fieldOne')
      .focus()
      .blur()
      .touched()
  })
})
