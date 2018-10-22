import * as R from 'ramda'
import url from 'url'

/**
 * Opens a Storybook story based on the given story path.
 * Based on the stories path, so name- and case-sensitive.
 */
Cypress.Commands.add('loadStory', (storyPath) => {
  const selectedKind = R.compose(
    R.join('|'),
    R.dropLast(1),
  )(storyPath)
  const selectedStory = R.last(storyPath)

  const storyUrl = url.format({
    /**
     * Open the iframe document, since Cypress will not be able
     * to propagate events to an iframe.
     */
    pathname: '/iframe.html',
    query: {
      selectedKind,
      selectedStory,
      full: 1,
      stories: 0,
      addons: 0,
      panelRight: 0,
    },
  })

  return cy.log(`Open "${selectedStory}" in "${selectedKind}"`).visit(storyUrl)
})

Cypress.Commands.add('getField', (fieldName) => {
  return cy.log(`Get field "${fieldName}"`).get(`[name="${fieldName}"]`)
})

Cypress.Commands.add(
  'hasValue',
  { prevSubject: true },
  (subject, expectedValue) => {
    cy.log(`Assert value "${expectedValue}"`)
      .wrap(subject)
      .should('have.value', expectedValue)
  },
)

Cypress.Commands.add('typeIn', { prevSubject: true }, (subject, nextText) => {
  cy.log(`Type "${nextText}"`)
    .wrap(subject)
    .type(nextText, { delay: 50 })
    .should('have.value', nextText)
})

Cypress.Commands.add(
  'touched',
  { prevSubject: true },
  (subject, expectedValue = true) => {
    cy.wrap(subject).should(
      [!expectedValue && 'not', 'have', 'class'].filter(Boolean).join('.'),
      'is-touched',
    )
  },
)

Cypress.Commands.add('markChecked', { prevSubject: true }, (subject, text) => {
  cy.log('Check')
    .wrap(subject)
    .check({ force: true })
    .should('be.checked')
    .blur({ force: true })
})

Cypress.Commands.add(
  'markUnchecked',
  { prevSubject: true },
  (subject, text) => {
    cy.log('Uncheck')
      .wrap(subject)
      .uncheck({ force: true })
      .should('not.be.checked')
      .blur({ force: true })
  },
)

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
    cy.log('Assert expected')
      .wrap(subject)
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
    cy.log('Assert valid')
      .wrap(subject)
      .should(`${prefix}have.class`, 'is-valid')
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
      .log('Assert validated')
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
    cy.log('Assert valid sync')
      .wrap(subject)
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
    cy.log('Assert valid async')
      .wrap(subject)
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
    cy.log('Assert has error')
      .wrap(subject)
      .siblings('.invalid-feedback')
      .should('be.visible')
      .should('have.text', errorText)
  },
)
