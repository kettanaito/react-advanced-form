const useFirstSchema = () => cy.get('#btn-one').click()
const useSecondSchema = () => cy.get('#btn-two').click()

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

    cy.getField('fieldTwo')
      .hasValue('bar')
      .expected(false)
  })

  it('Properly validates after schema is changed on runtime', () => {
    useSecondSchema()
    cy.getField('fieldOne')
      .expected()
      .clear()
      .type('foo')
      .expected(false)

    useFirstSchema()
    cy.getField('fieldOne').expected()
  })

  it('Resets validation state of fields not present in next schema', () => {
    useSecondSchema()
    cy.getField('fieldTwo')
      .valid(false)
      .invalid(false)
  })
})
