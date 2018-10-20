describe('Form rules', function() {
  before(() => {
    cy.loadStory(['Validation', 'Synchronous validation', 'Form rules'])
  })

  it('Resolves empty optional field with relevant form rules', () => {
    cy.getField('fieldOne')
      .focus()
      .blur({ force: true })
      .valid(false)
      .invalid(false)
  })

  it('Resets validation status after clearing optional unexpected field', () => {
    cy.getField('fieldOne')
      .clear()
      .typeIn('foo')
      .validSync(false)
      .clear()
      .blur({ force: true })
      .valid(false)
      .invalid(false)
  })

  it('Retains validation status after clearing required unexpected field', () => {
    cy.getField('fieldThree')
      .clear()
      .typeIn('foo')
      .validSync(false)
      .clear()
      .blur({ force: true })
      .validSync(false)
  })

  it('Resolves optional field with name-specific matching value', () => {
    cy.getField('fieldOne')
      .clear()
      .typeIn('some')
      .validSync()
  })

  it('Rejects optional field with name-specific unmatching value', () => {
    cy.getField('fieldOne')
      .clear()
      .typeIn('foo')
      .validSync(false)
  })

  it('Resolves optional field with type-specific matching value', () => {
    cy.getField('fieldOne')
      .clear()
      .typeIn('some')
      .validSync()
  })

  it('Rejects optional field with type-specific unmatching value', () => {
    cy.getField('fieldOne')
      .clear()
      .typeIn('ba')
      .validSync(false)
  })

  it('Resolves required field with name-specific matching value', () => {
    cy.getField('fieldThree')
      .clear()
      .typeIn('some')
      .validSync()
  })

  it('Rejects required field with name-specific unmatching value', () => {
    cy.getField('fieldThree')
      .clear()
      .typeIn('foo')
      .validSync(false)
  })

  it('Re-evaluates rule when referenced field prop updates', () => {
    cy.getField('fieldOne')
      .clear()
      .typeIn('something')

    cy.getField('fieldTwo')
      .typeIn('foo')
      .validSync(false)
      .clear()
      .typeIn('something')
      .validSync()
  })
})
