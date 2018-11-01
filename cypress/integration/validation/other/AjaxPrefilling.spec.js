import { timeoutDuration } from '@examples/validation/misc/AjaxPrefilling'

describe('Ajax Pre-filling', function() {
  before(() => {
    cy.loadStory(['Validation', 'Misc', 'Ajax pre-filling'])

    cy.get('#ajax')
      .click()
      .wait(timeoutDuration)
  })

  it('Pre-fills value properly', () => {
    cy.getField('street')
      .hasValue('Baker')
      .expected()
  })

  it('Pre-fills value of nested groupped field properly', () => {
    cy.getField('firstName')
      .hasValue('John')
      .valid(false)
      .invalid(false)
    cy.getField('lastName')
      .hasValue('Maverick')
      .valid(false)
      .invalid(false)
  })

  it('Validates pre-filled value properly', () => {
    cy.getField('houseNumber')
      .hasValue('error')
      .expected(false)
  })
})
