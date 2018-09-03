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
    cy.getField('firstName').hasValue('John')
    cy.getField('houseNumber').hasValue('4')
  })

  it('Takes "Form.props.initialValues"', () => {
    cy.getField('username')
      .hasValue(initialValues.username)
      .expected()

    cy.get('#billing-street').hasValue(initialValues.billingAddress.street)

    cy.get('#delivery-street').hasValue(initialValues.deliveryAddress.street)
  })

  it('Takes field-wide "initialValue" as the last fallback, when such value is set', () => {
    cy.getField('occupation').hasValue('developer')
  })
})
