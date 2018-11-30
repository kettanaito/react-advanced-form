import { expect } from 'chai'

const clear = () => cy.get('#clear').click()
const clearPredicate = () => cy.get('#clear-predicate').click()

describe('Reset', function() {
  before(() => {
    cy.loadStory(['Basics', 'Interaction', 'Clear'])
  })

  it('Clears the fields properly', () => {
    cy.getField('username').typeIn('admin')
    cy.getField('password').typeIn('secret')
    cy.getField('customerType')
      .first()
      .markChecked()

    clear()

    cy.window().should(($window) => {
      const { fields } = $window.form.state
      expect(Object.keys(fields)).to.include.all.members([
        'username',
        'password',
        'customerType',
      ])

      const serialized = $window.form.serialize()
      expect(serialized).to.deep.equal({})
    })
  })

  it('Clears only the fields matching a predicate', () => {
    cy.getField('username').typeIn('admin')
    cy.getField('password').typeIn('secret')
    cy.getField('customerType')
      .first()
      .markChecked()

    clearPredicate()

    cy.window().should(($window) => {
      const { fields } = $window.form.state
      expect(Object.keys(fields)).to.include.all.members([
        'username',
        'password',
        'customerType',
      ])

      const serialized = $window.form.serialize()
      expect(serialized).to.deep.equal({
        customerType: 'b2c',
      })
    })
  })
})
