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

Cypress.Commands.add('typeIn', { prevSubject: true }, (subject, text) => {
  cy.wrap(subject)
    .type(text)
    .should('have.value', text)
})

Cypress.Commands.add('loadStory', (story) => {
  mount(<StoryContainer>{story}</StoryContainer>)
})

Cypress.Commands.add(
  'valid',
  { prevSubject: true },
  (subject, expected = true) => {
    cy.wrap(subject)
      .should('have.class', expected ? 'is-valid' : 'is-invalid')
      .should('not.have.class', expected ? 'is-invalid' : 'is-valid')
  },
)

Cypress.Commands.add(
  'validating',
  { prevSubject: true },
  (subject, expected = true) => {
    const prefix = expected ? '' : 'not.'
    cy.wrap(subject).should(`${prefix}have.class`, 'is-validating')
  },
)

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

// Cypress.Commands.add(
//   'valid',
//   { prevSubject: true },
//   (subject, validationType = true, expected = true) => {
//     if (typeof validationType === 'string') {
//       const prefix = expected ? '' : 'not.'
//       return cy
//         .wrap(subject)
//         .should('have.class', `validated-${validationType}`)
//         .should(`${prefix}have.class`, `valid-${validationType}`)
//     }

//     return cy
//       .wrap(subject)
//       .should('have.class', validationType ? 'is-valid' : 'is-invalid')
//   },
// )

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

Cypress.Commands.add(
  'hasError',
  { prevSubject: true },
  (subject, errorText) => {
    cy.wrap(subject)
      .siblings('.invalid-feedback')
      .should('have.text', errorText)
  },
)
