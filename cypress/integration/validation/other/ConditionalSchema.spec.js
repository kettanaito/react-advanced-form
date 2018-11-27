const toggleSchema = () => cy.get('button').click()

describe('Conditional schema', function() {
  before(() => {
    cy.loadStory(['Validation', 'Other', 'Conditional schema'])
  })

  it('Properly validates with initial schema', () => {
    cy.getField('fieldOne')
      .valid(false)
      .invalid(false)
      .type('fo')
      .invalid()
      .type('o')
      .expected()
      .clear()
      .type('bar')
      .expected(false)
  })

  it('Properly validates after schema is changed on runtime', () => {
    toggleSchema()
    cy.getField('fieldOne')
      .expected()
      .clear()
      .type('foo')
      .expected(false)

    toggleSchema()
    cy.getField('fieldOne').expected()
  })
})