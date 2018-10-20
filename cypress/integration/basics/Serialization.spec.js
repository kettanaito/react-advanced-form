import { expect } from 'chai'
import { formatAddress } from '@examples/basics/Serialize'

describe('Serialization', function() {
  before(() => {
    cy.loadStory(['Basics', 'Interaction', 'Serialize'])
  })

  const submit = () => cy.get('button[type="submit"]').click()

  it('Applies custom serialization transformer, when specified', () => {
    cy.window().should(($window) => {
      const { fields } = $window.form.state
      const { street, houseNumber } = formatAddress(
        fields.billingAddress.address.value,
      )
      const serialized = $window.form.serialize()

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
