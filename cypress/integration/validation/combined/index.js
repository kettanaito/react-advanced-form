const resetForm = () => cy.get('[type="reset"]').click()

describe('Combined validation', function() {
  before(() => {
    cy._loadStory(['Validation', 'Combined validation', 'Combined validation'])
  })

  afterEach(() => {
    resetForm()
  })

  it('Bypasses async validation when preceding sync validation rejects', () => {
    cy.getField('fieldOne')
      .focus()
      .typeIn('letters')
      .validated('sync')
      .expected(false)
      .validSync(false)
      .blur({ force: true })
      .wait(500)
      .expected(false)
      .validated('sync', true)
      .validated('async', false)
  })

  it('Rejects async validation that does not satisfy the predicate', () => {
    cy.getField('fieldOne')
      .focus()
      .typeIn('123')
      .validSync()
      .blur({ force: true })
      .validSync()
      .wait(500)
      .expected(false)
      .validated('async')
      .validAsync(false)
  })

  it('Resolves async validation that satisfies the predicate', () => {
    cy.getField('fieldOne')
      .focus()
      .typeIn('456')
      .validSync()
      .blur({ force: true })
      .validSync()
      .wait(500)
      .expected()
      .validSync()
      .validAsync()
  })

  it('Supports multiple resolvers for a single selector', () => {
    cy.getField('userPassword')
      /* Asserting invalid when empty */
      .focus()
      .blur({ force: true })
      .invalid()
      /* Asserting none rules passed */
      .focus()
      .type('completely wrong value')
      .expected(false)
      .clear('')
      /* Asserting the first rule passed */
      .type('P')
      .expected(false)
      /* Asserting the second rule passed */
      .type('roper')
      .expected(false)
      /* Asserting all rules passed */
      .type('123')
      .expected(true)
  })
})
