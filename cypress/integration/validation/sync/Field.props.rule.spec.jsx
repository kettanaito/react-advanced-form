import React from 'react'
import Scenario from '@examples/validation/sync/Field.props.rule'

describe('Field rules', function() {
  before(() => {
    cy.loadStory(<Scenario getRef={(form) => (this.form = form)} />)
  })

  afterEach(() => {
    this.form.reset()
    cy.wait(50)
  })

  it('Resolves empty optional field with sync rule', () => {
    cy.getField('fieldOne')
      .focus()
      .blur({ force: true })
      .valid(false)
      .invalid(false)
    // .should('not.have.class', 'is-valid')
    // .should('not.have.class', 'is-invalid')
  })

  it('Rejects empty required field with sync rule', () => {
    cy.getField('fieldTwo')
      .focus()
      .blur({ force: true })
      .validSync(false)
  })

  it('Reslolves filled optional field with matching value', () => {
    cy.getField('fieldOne')
      .typeIn('123')
      .blur({ force: true })
      .validSync()
  })

  it('Rejects filled optional field with unmatching value', () => {
    cy.getField('fieldOne')
      .typeIn('foo')
      .blur({ force: true })
      .validSync(false)
  })

  it('Resolves filled required field with matching value', () => {
    cy.getField('fieldTwo')
      .typeIn('foo')
      .blur({ force: true })
      .validSync()
  })

  it('Rejects filled required field with unmatching value', () => {
    cy.getField('fieldTwo')
      .typeIn('123')
      .blur({ force: true })
      .validSync(false)
  })
})
