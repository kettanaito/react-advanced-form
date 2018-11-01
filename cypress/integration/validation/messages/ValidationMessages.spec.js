import React from 'react'
import { messages } from '@examples/validation/messages/ValidationMessages'
import { messages as formMessages } from '@examples/validation/sync/Form.props.rules'

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
        .hasError(messages.name.nameTwo.invalid)

      cy.getField('nameTwo')
        .clear()
        .typeIn('foo')
        .blur()
        .hasError(false)
    })
  })

  describe('Named messages', function() {
    before(() => {
      cy.loadStory(['Validation', 'Synchronous validation', 'Form rules'])
    })

    it('Field with custom value instance', () => {
      const assertError = (errorText) => {
        return cy
          .getField('birthDate')
          .parent()
          .hasError(errorText)
      }

      /* Invaid day */
      cy.getField('birthDate')
        .eq(0)
        .typeIn('90')
      assertError(
        formMessages.name.birthDate.rule.year +
          formMessages.name.birthDate.rule.month +
          formMessages.name.birthDate.rule.day,
      )

      /* Valid day */
      cy.getField('birthDate')
        .eq(0)
        .clear()
        .typeIn('24')
      assertError(
        formMessages.name.birthDate.rule.year +
          formMessages.name.birthDate.rule.month,
      )

      /* Invalid month */
      cy.getField('birthDate')
        .eq(1)
        .typeIn('13')
      assertError(
        formMessages.name.birthDate.rule.year +
          formMessages.name.birthDate.rule.month,
      )

      /* Valid month */
      cy.getField('birthDate')
        .eq(1)
        .clear()
        .typeIn('12')
      assertError(formMessages.name.birthDate.rule.year)

      /* Invalid year */
      cy.getField('birthDate')
        .eq(2)
        .typeIn('900')
      assertError(formMessages.name.birthDate.rule.year)

      /* Valid year */
      cy.getField('birthDate')
        .eq(2)
        .clear()
        .typeIn('2018')
      assertError(false)
    })
  })
})
