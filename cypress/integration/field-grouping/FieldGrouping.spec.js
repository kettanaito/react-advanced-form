import { expect } from 'chai'

describe('Field grouping', function() {
  before(() => {
    cy.loadStory(['Advanced', 'Field grouping', 'Field grouping'])
  })

  it('Supports simple group', () => {
    cy.window().should(($window) => {
      const serialized = $window.form.serialize()
      expect(serialized.customerType).to.equal('b2b')
    })
  })

  it('Supports nested groups', () => {
    cy.window().should(($window) => {
      const serialized = $window.form.serialize()
      expect(serialized.billingAddress).to.deep.equal({
        firstName: 'John',
        lastName: 'Maverick',
        userInfo: {
          firstName: 'Cathaline',
        },
      })
    })
  })

  it('Supports split groups', () => {
    cy.window().should(($window) => {
      const serialized = $window.form.serialize()
      expect(serialized.billingAddress.lastName).to.equal('Maverick')
    })
  })

  it('Supports exact field group name', () => {
    cy.window().should(($window) => {
      const serialized = $window.form.serialize()
      expect(serialized.primaryInfo).to.deep.equal({
        email: 'john.maverick@email.com',
        password: '123',
      })
    })
  })

  it('Serializes grouped fields properly', () => {
    cy.window().should(($window) => {
      const serialized = $window.form.serialize()

      expect(serialized).to.deep.equal({
        customerType: 'b2b',
        primaryInfo: {
          email: 'john.maverick@email.com',
          password: '123',
        },
        billingAddress: {
          firstName: 'John',
          lastName: 'Maverick',
          userInfo: {
            firstName: 'Cathaline',
          },
        },
      })
    })
  })
})
