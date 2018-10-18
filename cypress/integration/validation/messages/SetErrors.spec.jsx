const resetForm = () => cy.get('[type="reset"]').click()
const setBothErrors = () => cy.get('#set-both').click()
const setExplicitNull = () => cy.get('#set-null').click()

describe('Form-wide errors', function() {
  before(() => {
    cy._loadStory(['Validation', 'Messages', 'Set errors'])
  })

  afterEach(() => {
    resetForm()
  })

  it('Sets error messages for fields', () => {
    setBothErrors()

    cy.getField('fieldOne')
      .invalid()
      .hasError('foo')
    cy.getField('firstName')
      .invalid()
      .hasError('bar')
  })

  it('Preserves validity state when setting explicit "null"', () => {
    cy.getField('fieldOne')
      .typeIn('123')
      .blur()
      .valid()

    setBothErrors()
    cy.getField('fieldOne')
      .invalid()
      .hasError('foo')

    setExplicitNull()
    cy.getField('fieldOne').valid()
    cy.getField('firstName').invalid()
  })
})
