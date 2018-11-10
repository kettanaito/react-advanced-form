describe('Set values', () => {
  const setValues = () => cy.get('button').click()

  before(() => {
    cy.loadStory(['Basics', 'Interaction', 'Set values'])
  })

  it('Sets values properly', () => {
    cy.getField('username').hasValue('admin')
    cy.getField('customerType').hasValue('b2b')

    setValues()

    cy.getField('username')
      .hasValue('user')
      .expected(false)
    cy.getField('customerType').hasValue('b2c')
  })
})
