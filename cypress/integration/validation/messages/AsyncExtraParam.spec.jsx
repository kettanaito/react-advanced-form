import React from 'react'
import Scenario from '@examples/validation/async/Field.props.asyncRule'

describe('Async extra param', function() {
  before(() => {
    cy.loadStory(<Scenario getRef={(form) => (this.form = form)} />)
  })

  afterEach(() => {
    this.form.reset()
    cy.wait(50)
  })

  it('Displays error message with "extra" params from response', () => {
    cy.getField('fieldFour')
      .typeIn('foo')
      .blur({ force: true })
      // .validating()
      .wait(500)
      // .validating(false)
      .hasError('Data from async response')
  })
})
