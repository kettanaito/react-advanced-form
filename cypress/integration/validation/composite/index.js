import React from 'react'
import Scenario from '@examples/validation/composite'

describe('Composite validation', function() {
  before(() => {
    cy.loadStory(<Scenario getRef={(form) => (this.form = form)} />)
  })

  afterEach(() => {
    this.form.reset()
  })

  it('Prevents async validation call when sync validation rejects', () => {
    cy
      .getField('fieldOne')
      .focus()
      .typeIn('foo')
      .validated('sync')
      .valid(false)
      .validSync(false)
      .blur({ force: true })
      .wait(500)
      .valid(false)
      .validated('sync', true)
      .validated('async', false)
  })

  it('Rejects async validation not satisfying the predicate', () => {
    cy
      .getField('fieldOne')
      .focus()
      .typeIn('123')
      .validSync()
      .blur({ force: true })
      .validSync()
      .wait(500)
      .valid(false)
      .validated('async')
      .validAsync(false)
  })

  it('Resolves async validation satisfying the predicate', () => {
    cy
      .getField('fieldOne')
      .focus()
      .typeIn('456')
      .validSync()
      .blur({ force: true })
      .validSync()
      .wait(500)
      .valid()
      .validSync()
      .validAsync()
  })
})
