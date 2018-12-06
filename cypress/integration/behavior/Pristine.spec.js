describe('Pristine', () => {
  before(() => {
    cy.loadStory(['Basics', 'Interaction', 'Pristine'])
  })

  it('Field with initial value is mounted as pristine', () => {
    cy.getField('firstName')
      .hasValue('John')
      .pristine()
  })

  it('Focus and blur has no effect over "pristine" state', () => {
    cy.getField('username')
      .pristine()
      .focus()
      .blur()
      .pristine()
  })

  it('Field loses "pristine" when its value is changed', () => {
    cy.getField('username')
      .typeIn('admin')
      .pristine(false)
  })

  it('Field loses "pristine" when the form is reset', () => {
    // do double click since Cypress doesn't trigger clicks on buttons sometimes
    cy.get('#reset')
      .click()
      .click()
    cy.getField('username').pristine()
    cy.getField('firstName').pristine()
  })
})
