import { assert, expect } from 'chai'
import { submitTimeout } from '@examples/basics/SubmitCallbacks'

const submitForm = () => cy.get('button[type="submit"]').click()

describe('Submit', () => {
  before(() => {
    cy.loadStory(['Basics', 'Interaction', 'Form submit'])
  })

  it('Prevents form submit unless all fields are expected', () => {
    cy.getField('email')

    submitForm()
    cy.getField('email').valid(false)
    cy.getField('password').valid(false)
    cy.getField('termsAndConditions').valid(false)
    cy.get('#submitting').should('not.be.visible')

    cy.getField('email')
      .typeIn('foo')
      .valid()

    submitForm()
    cy.getField('password').valid(false)
    cy.getField('termsAndConditions').valid(false)
    cy.get('#submitting').should('not.be.visible')

    cy.getField('password')
      .typeIn('bar')
      .valid()
    submitForm()
    cy.getField('termsAndConditions').valid(false)
    cy.get('#submitting').should('not.be.visible')

    cy.getField('termsAndConditions')
      .markChecked()
      .valid()

    submitForm()
    cy.get('#submitting').should('be.visible')
  })

  describe('Callback methods', function() {
    beforeEach(() => {
      cy.loadStory(['Basics', 'Interaction', 'Submit callbacks'])
    })

    it('Calls "onInvalid" when invalid fields prevent form submit', () => {
      cy.getField('email')
        .clear()
        .typeIn('foo')
        .blur()
        .valid(false)

      submitForm()
      cy.get('#submit-start').should('not.be.visible')
      cy.get('#invalid').should('be.visible')
    })

    it('Calls "onSubmitStart" when successful submit starts', () => {
      submitForm()
      cy.get('#submit-start').should('be.visible')
    })

    it('Calls "onSubmitted" when "action" Promise resolves', () => {
      /* Assert exact value accepted by moked async submit action */
      cy.getField('email').hasValue('expected@email.example')
      submitForm()
        .wait(submitTimeout)
        .then(() => {
          cy.get('#submitted').should('be.visible')
        })
    })

    it('Calls "onSubmitFailed" when "action" Promise rejects', () => {
      cy.getField('email')
        .clear()
        .typeIn('inexpected@email.example')
        .blur()
        .valid(true)

      submitForm()
      cy.wait(submitTimeout)
      cy.get('#submitted').should('not.be.visible')
      cy.get('#submit-failed').should('be.visible')
    })

    it('Calls "onSubmitEnd" upon submit end', () => {
      submitForm().wait(submitTimeout)
      cy.get('#submit-end').should('be.visible')
    })
  })
})
