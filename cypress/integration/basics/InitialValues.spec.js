import { initialValues } from '@examples/basics/InitialValues'

describe('Initial values', function() {
  before(() => {
    cy._loadStory(['Basics', 'Interaction', 'Initial values'])
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
