describe('Field types', function() {
  before(() => {
    cy.loadStory(['Basics', 'Interaction', 'Uncontrolled fields'])
  })

  it('Sets "type: text" on inputs by default', () => {
    cy.getField('inputOne').should('have.attr', 'type', 'text')
    cy.getField('inputTwo').should('have.attr', 'type', 'text')
    cy.getField('inputTwo').should('have.attr', 'type', 'text')
  })

  it('Sets custom "type" for Radio, Checkbox', () => {
    cy.getField('radio')
      .first()
      .should('have.attr', 'type', 'radio')
    cy.getField('checkboxOne').should('have.attr', 'type', 'checkbox')
  })

  it('Sets no "type" on Select, Textarea', () => {
    cy.getField('select').should('not.have.attr', 'type')
    cy.getField('textareaOne').should('not.have.attr', 'type')
  })

  describe('Custom field types', () => {
    before(() => {
      cy.loadStory(['Other', 'Full examples', 'Registration form'])
    })

    it('Sets custom "type" for inputs', () => {
      cy.getField('userEmail').should('have.attr', 'type', 'email')
      cy.getField('userPassword').should('have.attr', 'type', 'password')
    })

    it('Allows deviation of "type" on custom fields (BirthDate)', () => {
      cy.getField('birthDate')
        .first()
        .should('have.attr', 'type', 'text')
    })
  })
})
