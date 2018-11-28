import { debounceDuration } from '@examples/basics/DebouncedChange'

before(() => {
  cy.loadStory(['Basics', 'Interaction', 'Debounced change'])
})

it('Debounced change', () => {
  cy.getField('username')
    .typeIn('foo')
    .wait(debounceDuration)
  cy.get('#username-label').should('have.text', 'foo')

  cy.getField('username')
    .type('{backspace}')
    .hasValue('fo')
    .wait(debounceDuration)
  cy.get('#username-label').should('have.text', 'fo')

  cy.getField('username')
    .type('{backspace}{backspace}')
    .hasValue('')
    .wait(debounceDuration)
  cy.get('#username-label').should('have.text', '')
})
