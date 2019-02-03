const reset = () => cy.get('#default-reset').click()

describe('Touched', () => {
  before(() => {
    cy.loadStory(['Basics', 'Interaction', 'Reset'])
  })

  it('Field becomes touched upon blur', () => {
    cy.getField('username')
      .touched(false)
      .focus()
      .touched(false)
      .wait(50)
      .blur({ force: true })
      .touched()
  })

  it('Field is untouched after reset', () => {
    reset()
    cy.getField('username').touched(false)
  })
})
