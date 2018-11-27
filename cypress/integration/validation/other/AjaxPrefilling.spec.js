import { timeoutDuration } from '@examples/validation/other/AjaxPrefilling'

describe('AJAX Pre-filling', function() {
  before(() => {
    cy.loadStory(['Validation', 'Other', 'Ajax pre-filling'])

    cy.get('#ajax')
      .click()
      .wait(timeoutDuration)
  })

  it('Pre-fills value properly', () => {
    cy.getField('street')
      .hasValue('Baker')
      .expected()
  })

  it('Validates pre-filled value properly', () => {
    cy.getField('streetRule')
      .hasValue('Baker')
      .expected(false)
  })
})
