describe('Async extra param', function() {
  before(() => {
    cy._loadStory(['Validation', 'Asynchronous validation', 'Field async rule'])
  })

  it('Displays error message with "extra" params from response', () => {
    cy.getField('fieldFour')
      .typeIn('foo')
      .blur({ force: true })
      .wait(500)
      .hasError('Data from async response')
  })
})
