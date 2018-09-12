// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import React from 'react'
import { mount } from 'cypress-react-unit-test'
import StoryContainer from './StoryContainer'

Cypress.Commands.add('getField', (fieldName) => {
  return cy.get(`[name="${fieldName}"]`)
})

Cypress.Commands.add('hasValue', { prevSubject: true }, (subject, expectedValue) => {
  cy.wrap(subject).should('have.value', expectedValue)
})

Cypress.Commands.add('typeIn', { prevSubject: true }, (subject, text) => {
  cy.wrap(subject)
    .type(text, { delay: 30 })
    .hasValue(text)
})

Cypress.Commands.add('loadStory', (story) => {
  mount(<StoryContainer>{story}</StoryContainer>)
})

/**
 * Asserts the given subject as expected field.
 * Expected implies mutually excluding behavior of validity props.
 * Use this command to assert strict validity. Use granular "valid" or "invalid" commands
 * to assert precise validity, or neither of them.
 */
Cypress.Commands.add('expected', { prevSubject: true }, (subject, expected = true) => {
  cy.wrap(subject)
    .should('have.class', expected ? 'is-valid' : 'is-invalid')
    .should('not.have.class', expected ? 'is-invalid' : 'is-valid')
})

/**
 * Asserts that the given subject field is valid.
 */
Cypress.Commands.add('valid', { prevSubject: true }, (subject, expected = true) => {
  const prefix = expected ? '' : 'not.'
  cy.wrap(subject).should(`${prefix}have.class`, 'is-valid')
})

/**
 * Asserts that the given subject field is invalid.
 */
Cypress.Commands.add('invalid', { prevSubject: true }, (subject, expected = true) => {
  const prefix = expected ? '' : 'not.'
  cy.wrap(subject).should(`${prefix}have.class`, 'is-invalid')
})

/**
 * Asserts that the given subject field is being validated.
 */
Cypress.Commands.add('validating', { prevSubject: true }, (subject, expected = true) => {
  const prefix = expected ? '' : 'not.'
  cy.wrap(subject).should(`${prefix}have.class`, 'is-validating')
})

/**
 * Asserts that the validation of the given type on the subject field.
 * Can be used for both positive and negative assertions.
 */
Cypress.Commands.add(
  'validated',
  { prevSubject: true },
  (subject, validationType, expected = true) => {
    const prefix = expected ? '' : 'not.'
    return cy.wrap(subject).should(`${prefix}have.class`, `validated-${validationType}`)
  },
)

/**
 * Asserts the synchronous validity of the given subject field.
 * Can be used for both positive and negative assertions.
 */
Cypress.Commands.add('validSync', { prevSubject: true }, (subject, expected = true) => {
  const prefix = expected ? '' : 'not.'
  cy.wrap(subject)
    .should('have.class', 'validated-sync')
    .should(`${prefix}have.class`, 'valid-sync')
})

/**
 * Asserts the asynchronous validity of the given subject field.
 * Can be used for both positive and negative assertions.
 */
Cypress.Commands.add('validAsync', { prevSubject: true }, (subject, expected = true) => {
  const prefix = expected ? '' : 'not.'
  cy.wrap(subject)
    .should('have.class', 'validated-async')
    .should(`${prefix}have.class`, 'valid-async')
})

/**
 * Asserts the error on the given subject field.
 */
Cypress.Commands.add('hasError', { prevSubject: true }, (subject, errorText) => {
  cy.wrap(subject)
    .siblings('.invalid-feedback')
    .should('have.text', errorText)
})
