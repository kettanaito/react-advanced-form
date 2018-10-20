import { expect } from 'chai'

it('Serializes split field groups properly', () => {
  cy.loadStory(['Advanced', 'Field grouping', 'Split groups'])

  cy.window().should(($window) => {
    const serialized = $window.form.serialize()

    expect(serialized).to.deep.equal({
      email: 'john@maverick.com',
      password: 'super-secret',
      primaryInfo: {
        firstName: 'John',
        lastName: 'Maverick',
        newsletter: true,
        billingAddress: {
          street: 'Sunwell ave.',
          houseNumber: '3',
        },
      },
      billingAddress: {
        noCollision: true,
      },
    })
  })
})
