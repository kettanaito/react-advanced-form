import React from 'react'
import Scenario from '@examples/basics/InitialValues'

describe('Initial values', function() {
  const initialValues = {
    firstName: 'Kate',
    username: 'admin',
    billingAddress: {
      street: 'Baker st.',
    },
    deliveryAddress: {
      street: 'Sunwell ave.',
    },
  }

  before(() => {
    cy.loadStory(<Scenario initialValues={initialValues} />)
  })

  it('Takes "fieldProps.initialValue" as the highest priority', () => {
    cy.getField('firstName').should('have.value', 'John')
    cy.getField('houseNumber').should('have.value', '4')
  })

  it('Takes "Form.props.initialValues"', () => {
    cy.getField('username')
      .should('have.value', initialValues.username)
      .valid()

    cy.get('#billing-street').should(
      'have.value',
      initialValues.billingAddress.street,
    )

    cy.get('#delivery-street').should(
      'have.value',
      initialValues.deliveryAddress.street,
    )
  })

  it('Takes field-wide "initialValue" as the last fallback, when such value is set', () => {
    cy.getField('occupation').should('have.value', 'developer')
  })
})
