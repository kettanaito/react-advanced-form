describe('Field rules', function() {
  before(() => {
    cy.loadStory(['Validation', 'Synchronous validation', 'Field rules'])
  })

  it('Resolves empty optional field with sync rule', () => {
    cy.getField('fieldOne')
      .focus()
      .blur({ force: true })
      .valid(false)
      .invalid(false)
  })

  it('Rejects empty required field with sync rule', () => {
    cy.getField('fieldTwo')
      .focus()
      .blur({ force: true })
      .validSync(false)
  })

  it('Reslolves filled optional field with matching value', () => {
    cy.getField('fieldOne')
      .typeIn('123')
      .blur({ force: true })
      .validSync()
  })

  it('Rejects filled optional field with unmatching value', () => {
    cy.getField('fieldOne')
      .clear()
      .typeIn('foo')
      .blur({ force: true })
      .validSync(false)
  })

  it('Resolves filled required field with matching value', () => {
    cy.getField('fieldTwo')
      .clear()
      .typeIn('foo')
      .blur({ force: true })
      .validSync()
  })

  it('Rejects filled required field with unmatching value', () => {
    cy.getField('fieldTwo')
      .clear()
      .typeIn('123')
      .blur({ force: true })
      .validSync(false)
  })
})
