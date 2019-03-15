const reset = () => cy.get('#reset').click()

describe('First change', () => {
  before(() => {
    cy.loadStory(['Basics', 'Interaction', 'First change'])
  })

  it('Calls "onFirstChange" when field changes', () => {
    cy.get('#dirty').should('not.be.visible')
    cy.get('#not-dirty').should('be.visible')

    cy.getField('email')
      .clear()
      .typeIn('changed@email.example')

    cy.get('#dirty').should('be.visible')
    cy.get('#not-dirty').should('not.be.visible')
  })

  it('Calls "onFirstChange" again when form is reset and field changes', () => {
    reset()

    cy.get('#dirty').should('not.be.visible')
    cy.get('#not-dirty').should('be.visible')

    cy.getField('email')
      .clear()
      .typeIn('changed@email.example')

    cy.get('#dirty').should('be.visible')
    cy.get('#not-dirty').should('not.be.visible')
  })
})
