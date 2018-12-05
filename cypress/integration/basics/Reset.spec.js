import * as R from 'ramda'
import { expect } from 'chai'

const reset = () => cy.get('#default-reset').click()
const resetWithPredicate = () => cy.get('#with-predicate').click()

describe('Reset', function() {
  before(() => {
    cy.loadStory(['Basics', 'Interaction', 'Reset'])
  })

  afterEach(() => {
    cy.window().then(($window) => $window.form.clear())
  })

  describe('Single interaction', function() {
    before(() => {
      cy.getField('username')
        .clear()
        .typeIn('admin')
        .expected()
      cy.getField('password')
        .clear()
        .typeIn('foo')
        .expected()
      cy.getField('termsAndConditions')
        .markChecked()
        .expected()

      reset()
    })

    it('Resets changed field to its initial value', () => {
      cy.getField('username')
        .hasValue('john.doe')
        .expected()
    })

    it('Does not validate empty reset field', () => {
      cy.getField('firstName')
        .hasValue('')
        .validated('sync', false)
        .validated('async', false)
        .valid(false)
        .invalid(false)
      cy.getField('password')
        .hasValue('')
        .valid(false)
        .invalid(false)
    })

    it('Has no effect over pristine field', () => {
      cy.getField('termsAndConditions')
        .should('not.be.checked')
        .valid(false)
        .invalid(false)
    })
  })

  it('Resets the fields that match a predicate', () => {
    cy.getField('username')
      .clear()
      .typeIn('admin')
    cy.getField('password')
      .clear()
      .typeIn('123')
    cy.getField('termsAndConditions')
      .markChecked()
      .expected()
    cy.getField('firstName')
      .clear()
      .typeIn('foo')

    resetWithPredicate()
    resetWithPredicate()

    /* Field that don't match a predicate remain untouched */
    cy.getField('username')
      .hasValue('admin')
      .expected()
    cy.getField('password')
      .hasValue('123')
      .expected()
    cy.getField('termsAndConditions')
      .should('be.checked')
      .expected()

    /* Fields that match a predicate get reset */
    cy.getField('firstName')
      .hasValue('')
      .valid(false)
      .invalid(false)

    cy.window().then(($window) => {
      const { fields } = $window.form.state
      expect(R.path(['username'], fields)).not.to.be.undefined
      expect(R.path(['password'], fields)).not.to.be.undefined
      expect(R.path(['termsAndConditions'], fields)).not.to.be.undefined
      expect(R.path(['billingAddress', 'firstName'], fields)).not.to.be
        .undefined
    })
  })
})
