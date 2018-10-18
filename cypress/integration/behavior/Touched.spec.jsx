describe('Touched', () => {
  before(() => {
    cy._loadStory(['Basics', 'Interaction', 'Form submit'])
  })

  it('Asserts a field is untouched by default', () => {
    cy.getField('email')
      .touched(false)
      .focus()
      .touched(false)
      .blur()
  })

  it('A field becomes touched after focus and blur', () => {
    cy.getField('email')
      .focus()
      .blur()
      .touched()
  })
})
