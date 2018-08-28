import React from 'react'
import { assert, expect } from 'chai'
import Scenario from '@examples/basics/Submit'
import CallbacksScenario, {
  submitTimeout,
} from '@examples/basics/SubmitCallbacks'

const resetCallbackCalls = (callbacks) => {
  return Object.keys(callbacks).reduce((obj, callbackName) => {
    return {
      ...obj,
      [callbackName]: false,
    }
  }, {})
}

describe('Submit', () => {
  let submitCount = 0
  const submit = () => cy.get('button[type="submit"]').click()

  before(() => {
    cy.loadStory(<Scenario onSubmitStart={() => submitCount++} />)
  })

  it('Prevents form submit unless all fields are expected', () => {
    cy.wait(20)
    submit()
    cy.getField('email').valid(false)
    cy.getField('password').valid(false)
    cy.getField('termsAndConditions').valid(false)
    expect(submitCount).to.equal(0)

    cy.getField('email')
      .type(' foo') // FIXME Cypress omits the first character due to whatever reason
      .valid()

    submit()
    cy.getField('password').valid(false)
    cy.getField('termsAndConditions').valid(false)
    expect(submitCount).to.equal(0)

    cy.getField('password')
      .typeIn('bar')
      .valid()
    submit()
    cy.getField('termsAndConditions').valid(false)
    expect(submitCount).to.equal(0)

    cy.getField('termsAndConditions')
      .check({ force: true })
      .should('be.checked')
      .blur()
      .valid()

    cy.get('button[type="submit"]')
      .click()
      .then(() => {
        expect(submitCount).to.equal(1)
      })
  })

  describe('Callback methods', function() {
    let callbacksCalled = {
      onInvalid: true,
      onSubmitStart: false,
      onSubmitted: false,
      onSubmitFailed: false,
      onSubmitEnd: false,
    }

    before(() => {
      cy.loadStory(
        <CallbacksScenario
          getRef={(formRef) => (this.form = formRef)}
          onInvalid={() => (callbacksCalled.onInvalid = true)}
          onSubmitStart={() => (callbacksCalled.onSubmitStart = true)}
          onSubmitted={() => (callbacksCalled.onSubmitted = true)}
          onSubmitFailed={() => (callbacksCalled.onSubmitFailed = true)}
          onSubmitEnd={() => (callbacksCalled.onSubmitEnd = true)}
        />,
      )
    })

    afterEach(() => {
      this.form.reset()
      callbacksCalled = resetCallbackCalls(callbacksCalled)
    })

    it('Calls "onInvalid" when invalid fields prevent form submit', () => {
      cy.getField('email')
        .clear()
        .type(' invalid email')
        .blur()
        .valid(false)

      submit().then(() => {
        assert(
          !callbacksCalled.onSubmitStart,
          'should not call "onSubmitStart"',
        )
        assert(callbacksCalled.onInvalid, 'should call "onInvalid"')
      })
    })

    it('Calls "onSubmitStart" when successful submit starts', () => {
      submit().then(() => {
        assert(callbacksCalled.onSubmitStart, 'should call "onSubmitStart"')
      })
    })

    it('Calls "onSubmitted" when "action" Promise resolves', () => {
      submit()
        .wait(submitTimeout)
        .then(() => {
          assert(callbacksCalled.onSubmitted, 'should call "onSubmitted"')
        })
    })

    it('Calls "onSubmitFailed" when "action" Promise rejects', () => {
      cy.getField('email')
        .clear()
        .type(' incorrect@email.example')
        .blur()
        .valid(true)

      submit()
        .wait(submitTimeout)
        .then(() => {
          assert(!callbacksCalled.onSubmitted, 'should not call "onSubmitted"')
          assert(callbacksCalled.onSubmitFailed, 'should call "onSubmitFailed"')
        })
    })

    it('Calls "onSubmitEnd" when submit ends, regardless of status', () => {
      submit()
        .wait(submitTimeout)
        .then(() => {
          assert(callbacksCalled.onSubmitEnd, 'should call "onSubmitEnd"')
        })
    })
  })
})
