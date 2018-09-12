import React from 'react'
import Scenario from '@examples/validation/combined'

describe('Composite validation', function() {
  before(() => {
    cy.loadStory(<Scenario getRef={(form) => (this.form = form)} />)
    cy.wait(200)
  })

  afterEach(() => {
    this.form.reset()
  })

  it('Bypasses async validation when preceding sync validation rejects', () => {
    cy.getField('fieldOne')
      .focus()
      .typeIn('letters')
      .validated('sync')
      .expected(false)
      .validSync(false)
      .blur({ force: true })
      .wait(500)
      .expected(false)
      .validated('sync', true)
      .validated('async', false)
  })

  it('Rejects async validation that does not satisfy the predicate', () => {
    cy.getField('fieldOne')
      .focus()
      .typeIn('123')
      .validSync()
      .blur({ force: true })
      .validSync()
      .wait(500)
      .expected(false)
      .validated('async')
      .validAsync(false)
  })

  it('Resolves async validation that satisfies the predicate', () => {
    cy.getField('fieldOne')
      .focus()
      .typeIn('456')
      .validSync()
      .blur({ force: true })
      .validSync()
      .wait(500)
      .expected()
      .validSync()
      .validAsync()
  })
})
