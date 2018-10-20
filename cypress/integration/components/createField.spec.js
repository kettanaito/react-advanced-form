describe('createField', function() {
  before(() => {
    cy.loadStory(['Components', 'createField'])
  })

  it('Supports custom field event handlers', () => {
    const testWord = 'Text'

    cy.getField('fieldOne').typeIn(testWord)
    cy.get('#count').should('have.text', String(testWord.length))
  })
})
