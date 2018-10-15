import React from 'react'
import { expect } from 'chai'
import Scenario, { formatAddress } from '@examples/basics/Serialize'

describe('Serialization', function() {
  before(() => {
    cy.loadStory(<Scenario getRef={(form) => (this.form = form)} />)
  })

  const submit = () => cy.get('button[type="submit"]').click()

  it('Applies custom serialization transformer, when specified', () => {
    cy.get('form').should(() => {
      const { fields } = this.form.state
      const { street, houseNumber } = formatAddress(
        fields.billingAddress.address.value,
      )
      const serialized = this.form.serialize()

      expect(serialized).to.deep.equal({
        email: fields.email.value,
        password: btoa(fields.password.value),
        billingAddress: {
          street,
          houseNumber,
        },
      })
    })
  })
})
