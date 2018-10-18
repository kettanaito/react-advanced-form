import React from 'react'
import { assert, expect } from 'chai'
import { submitTimeout } from '@examples/basics/SubmitCallbacks'

const submit = () => cy.get('button[type="submit"]').click()
const reset = () => cy.get('button[type="clear"]').click()

describe('Submit', () => {
  before(() => {
    cy._loadStory(['Basics', 'Interaction', 'Form submit'])
  })

  it('Prevents form submit unless all fields are expected', () => {
    submit()
    cy.getField('email').valid(false)
    cy.getField('password').valid(false)
    cy.getField('termsAndConditions').valid(false)
    cy.get('#submitting').should('not.be.visible')

    cy.getField('email')
      .typeIn('foo')
      .valid()

    submit()
    cy.getField('password').valid(false)
    cy.getField('termsAndConditions').valid(false)
    cy.get('#submitting').should('not.be.visible')

    cy.getField('password')
      .typeIn('bar')
      .valid()
    submit()

    cy.getField('termsAndConditions').valid(false)
    cy.get('#submitting').should('not.be.visible')

    cy.getField('termsAndConditions')
      .markChecked()
      .valid()

    submit().then(() => {
      cy.get('#submitting').should('be.visible')
    })
  })

  describe('Callback methods', function() {
    before(() => {
      cy._loadStory(['Basics', 'Interaction', 'Submit callbacks'])
    })

    afterEach(() => {
      reset()
    })

    it('Calls "onInvalid" when invalid fields prevent form submit', () => {
      cy.getField('email')
        .clear()
        .typeIn('foo')
        .blur()
        .valid(false)

      submit().then(() => {
        assert(
          cy.get('#submit-start').should('not.be.visible'),
          'should not call "onSubmitStart"',
        )
        assert(cy.get('#invalid'), 'should call "onInvalid"')
      })
    })

    it('Calls "onSubmitStart" when successful submit starts', () => {
      submit().then(() => {
        assert(cy.get('#submit-start'), 'should call "onSubmitStart"')
      })
    })

    it('Calls "onSubmitted" when "action" Promise resolves', () => {
      submit()
        .wait(submitTimeout)
        .then(() => {
          assert(cy.get('#submitted'), 'should call "onSubmitted"')
        })
    })

    it('Calls "onSubmitFailed" when "action" Promise rejects', () => {
      cy.getField('email')
        .clear()
        .typeIn('incorrect@email.example')
        .blur()
        .valid(true)

      submit()
        .wait(submitTimeout)
        .then(() => {
          assert(
            cy.get('#submitted').should('not.be.visible'),
            'should not call "onSubmitted"',
          )
          assert(cy.get('#submit-failed'), 'should call "onSubmitFailed"')
        })
    })

    it('Calls "onSubmitEnd" when submit ends, regardless of status', () => {
      submit()
        .wait(submitTimeout)
        .then(() => {
          assert(cy.get('#submit-end'), 'should call "onSubmitEnd"')
        })
    })
  })
})
