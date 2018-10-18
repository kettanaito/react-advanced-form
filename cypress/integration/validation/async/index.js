describe('Asynchronous validation', function() {
  before(() => {
    cy._loadStory(['Validation', 'Asynchronous validation', 'Field async rule'])
  })

  it('Bypasses async validation for empty optional field with async rule', () => {
    cy.getField('fieldOne')
      .focus()
      .blur({ force: true })
      .valid(false)
      .invalid(false)
  })

  it('Rejects empty required field with unsatisfied async rule', () => {
    cy.getField('fieldTwo')
      .focus()
      .blur({ force: true })
      .expected(false)
  })

  it('Resolves field that satisfies async rule', () => {
    cy.getField('fieldOne')
      .typeIn('expected value')
      .blur({ force: true })
      .wait(500)
      .expected()
  })

  it('Rejects field that does not satisfy async rule', () => {
    cy.getField('fieldOne')
      .clear()
      .typeIn('foo')
      .blur({ force: true })
      .wait(500)
      .expected(false)
  })

  it('Cancels pending async validation on field change', () => {
    cy.getField('fieldFour')
      .typeIn('foo')
      .blur({ force: true })
      .wait(200)
      .clear()
      .typeIn('bar')
      .wait(300)
      .should('not.have.class', 'is-invalid')
      .blur({ force: true })
      .wait(500)
      .expected()
  })
})
