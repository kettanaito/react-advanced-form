import React from 'react'
import { messages } from '@examples/validation/messages/ValidationMessages'

describe('Validation messages', function() {
  before(() => {
    cy.loadStory(['Validation', 'Messages', 'Validation messages'])
  })

  describe('General', function() {
    it('Provides no messages to optional field without rules', () => {
      cy.getField('generalOne')
        .focus()
        .blur()
        .hasError(false)

      cy.getField('generalOne')
        .typeIn('foo')
        .blur()
        .hasError(false)
    })

    it('Provides "general.missing" message to required field without rules', () => {
      cy.getField('generalTwo')
        .focus()
        .blur()
        .hasError(messages.general.missing)

      cy.getField('generalTwo')
        .typeIn('foo')
        .blur()
        .hasError(false)
    })
  })

  describe('Type-specific', function() {
    it('Provides no message for optional empty field with rule', () => {
      cy.getField('typeOne')
        .focus()
        .blur()
        .hasError(false)
    })

    it('Provides "type.invalid" message for unexpected optional field', () => {
      cy.getField('typeOne')
        .typeIn('foo')
        .blur()
        .hasError(messages.type.email.invalid)

      cy.getField('typeOne')
        .clear()
        .typeIn('email@example.com')
        .blur()
        .hasError(false)
    })

    it('Provides "type.missing" message for empty required field', () => {
      cy.getField('typeTwo')
        .focus()
        .blur()
        .hasError(messages.type.email.missing)
    })

    it('Provides "type.invalid" message for unexpected required field', () => {
      cy.getField('typeTwo')
        .typeIn('foo')
        .blur()
        .hasError(messages.type.email.invalid)

      cy.getField('typeTwo')
        .clear()
        .typeIn('email@example.com')
        .blur()
        .hasError(false)
    })
  })

  describe('Name-specific', function() {
    it('Provides no message for empty optional field', () => {
      cy.getField('nameOne')
        .focus()
        .blur()
        .hasError(false)
    })

    it('Provides "name.invalid" message for unexpected optional field', () => {
      cy.getField('nameOne')
        .typeIn('bar')
        .blur()
        .hasError(messages.name.nameOne.invalid)
    })

    it('Provides "name.missing" message for empty required field', () => {
      cy.getField('nameTwo')
        .focus()
        .blur()
        .hasError(messages.name.nameTwo.missing)
    })

    it('Provides "name.invalid" message for unexpected required field', () => {
      cy.getField('nameTwo')
        .typeIn('bar')
        .blur()
        .hasError('The name "bar" is invalid.')

      cy.getField('nameTwo')
        .clear()
        .typeIn('foo')
        .blur()
        .hasError(false)
    })
  })
})
