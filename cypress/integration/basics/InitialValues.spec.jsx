import React from 'react'
import { expect } from 'chai'
import Scenario from '@examples/basics/InitialValues'

describe('Initial values', function() {
  const initialValues = {
    firstName: 'Kate',
    username: 'admin',
  }

  before(() => {
    cy.loadStory(<Scenario initialValues={initialValues} />)
  })

  it('Takes "fieldProps.initialValue" as the highest priority', () => {
    cy.getField('firstName').should('have.value', 'John')
  })

  it('Takes "Form.props.initialValues" the highest priority source of initial value', () => {
    cy.getField('username')
      .should('have.value', initialValues.username)
      .valid()
  })

  it('Takes field-wide "initialValue" as the last fallback, when such value is set', () => {
    cy.getField('occupation').should('have.value', 'developer')
  })
})
