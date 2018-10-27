import React from 'react'
import { mount } from 'cypress-react-unit-test'
import StoryContainer from './StoryContainer'

Cypress.Commands.add('getField', (fieldName) => {
  return cy.get(`[name="${fieldName}"]`)
})

Cypress.Commands.add(
  'hasValue',
  { prevSubject: true },
  (subject, expectedValue) => {
    cy.wrap(subject).should('have.value', expectedValue)
  },
)

Cypress.Commands.add('typeIn', { prevSubject: true }, (subject, text) => {
  cy.wrap(subject)
    .type(text, { delay: 50 })
    .hasValue(text)
})

Cypress.Commands.add('markChecked', { prevSubject: true }, (subject, text) => {
  cy.wrap(subject)
    .check({ force: true })
    .should('be.checked')
    .blur({ force: true })
})

Cypress.Commands.add(
  'markUnchecked',
  { prevSubject: true },
  (subject, text) => {
    cy.wrap(subject)
      .uncheck({ force: true })
      .should('not.be.checked')
      .blur({ force: true })
  },
)

Cypress.Commands.add('loadStory', (story) => {
  mount(<StoryContainer>{story}</StoryContainer>)
})

/**
 * Asserts the given subject as expected field.
 * Expected implies mutually excluding behavior of validity props.
 * Use this command to assert strict validity. Use granular "valid" or "invalid" commands
 * to assert precise validity, or neither of them.
 */
Cypress.Commands.add(
  'expected',
  { prevSubject: true },
  (subject, expected = true) => {
    cy.wrap(subject)
      .should('have.class', expected ? 'is-valid' : 'is-invalid')
      .should('not.have.class', expected ? 'is-invalid' : 'is-valid')
  },
)

/**
 * Asserts that the given subject field is valid.
 */
Cypress.Commands.add(
  'valid',
  { prevSubject: true },
  (subject, expected = true) => {
    const prefix = expected ? '' : 'not.'
    cy.wrap(subject).should(`${prefix}have.class`, 'is-valid')
  },
)

/**
 * Asserts that the given subject field is invalid.
 */
Cypress.Commands.add(
  'invalid',
  { prevSubject: true },
  (subject, expected = true) => {
    const prefix = expected ? '' : 'not.'
    cy.wrap(subject).should(`${prefix}have.class`, 'is-invalid')
  },
)

/**
 * Asserts that the given subject field is being validated.
 */
Cypress.Commands.add(
  'validating',
  { prevSubject: true },
  (subject, expected = true) => {
    const prefix = expected ? '' : 'not.'
    cy.wrap(subject).should(`${prefix}have.class`, 'is-validating')
  },
)

/**
 * Asserts that the validation of the given type on the subject field.
 * Can be used for both positive and negative assertions.
 */
Cypress.Commands.add(
  'validated',
  { prevSubject: true },
  (subject, validationType, expected = true) => {
    const prefix = expected ? '' : 'not.'
    return cy
      .wrap(subject)
      .should(`${prefix}have.class`, `validated-${validationType}`)
  },
)

/**
 * Asserts the synchronous validity of the given subject field.
 * Can be used for both positive and negative assertions.
 */
Cypress.Commands.add(
  'validSync',
  { prevSubject: true },
  (subject, expected = true) => {
    const prefix = expected ? '' : 'not.'
    cy.wrap(subject)
      .should('have.class', 'validated-sync')
      .should(`${prefix}have.class`, 'valid-sync')
  },
)

/**
 * Asserts the asynchronous validity of the given subject field.
 * Can be used for both positive and negative assertions.
 */
Cypress.Commands.add(
  'validAsync',
  { prevSubject: true },
  (subject, expected = true) => {
    const prefix = expected ? '' : 'not.'
    cy.wrap(subject)
      .should('have.class', 'validated-async')
      .should(`${prefix}have.class`, 'valid-async')
  },
)

/**
 * Asserts the error on the given subject field.
 */
Cypress.Commands.add(
  'hasError',
  { prevSubject: true },
  (subject, errorText) => {
    const wrapper = cy.wrap(subject).siblings('.invalid-feedback')

    return errorText === false
      ? wrapper.should('not.exist')
      : wrapper.should('have.text', errorText)
  },
)
