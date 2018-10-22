describe('Reactive props', function() {
  it('Supports direct field subscription', () => {
    cy.loadStory(['Advanced', 'Reactive props', 'Dynamic required'])

    cy.getField('lastName').should('have.attr', 'required')
    cy.getField('lastName')
      .focus()
      .blur()
      .should('have.class', 'is-invalid')

    cy.getField('firstName').clear()
    cy.getField('lastName')
      .should('not.have.attr', 'required')
      .should('not.have.class', 'is-invalid')
  })

  it('Supports delegated field subscription', () => {
    cy.loadStory(['Advanced', 'Reactive props', 'Delegated subscription'])

    cy.getField('firstName').should('have.attr', 'required')
    cy.getField('firstName')
      .focus()
      .blur()
      .expected(false)

    cy.getField('lastName').clear()
    cy.getField('firstName').should('not.have.attr', 'required')
  })

  it('Supports inter-dependent fields', () => {
    cy.loadStory(['Advanced', 'Reactive props', 'Interdependent fields'])

    cy.getField('firstName').should('not.have.attr', 'required')
    cy.getField('lastName').should('not.have.attr', 'required')

    cy.getField('firstName').typeIn('foo')
    cy.getField('lastName').should('have.attr', 'required')
    cy.getField('firstName').clear()
    cy.getField('lastName').should('not.have.attr', 'required')

    cy.getField('lastName').typeIn('doe')
    cy.getField('firstName').should('have.attr', 'required')
    cy.getField('lastName').clear()
    cy.getField('firstName').should('not.have.attr', 'required')

    cy.getField('firstName').typeIn('foo')
    cy.getField('lastName').typeIn('doe')
    cy.getField('firstName').should('have.attr', 'required')
    cy.getField('lastName').should('have.attr', 'required')

    cy.getField('firstName').clear()
    cy.getField('lastName').clear()
    cy.getField('firstName').should('not.have.attr', 'required')
    cy.getField('lastName').should('not.have.attr', 'required')
  })

  it('Supports multiple fields depending on one target', () => {
    cy.loadStory(['Advanced', 'Reactive props', 'Single field target'])

    cy.getField('firstName').should('not.have.attr', 'required')
    cy.getField('fieldThree').should('not.have.attr', 'required')

    cy.getField('lastName').typeIn('foo')
    cy.getField('firstName')
      .expected(false)
      .should('have.attr', 'required')
    cy.getField('fieldThree')
      .expected(false)
      .should('have.attr', 'required')

    cy.getField('firstName')
      .typeIn('foo')
      .expected()

    cy.getField('fieldThree')
      .typeIn('doe')
      .expected()

    cy.getField('lastName')
      .clear()
      .should('not.have.value')
    cy.getField('firstName')
      .valid(false)
      .invalid(false)
      .should('not.have.attr', 'required')
    cy.getField('fieldThree')
      .valid(false)
      .invalid(false)
      .should('not.have.attr', 'required')
  })

  /**
   * @todo
   * Must be fixed under https://github.com/kettanaito/react-advanced-form/issues/304
   */
  // it('Supports field "rule" as a reactive prop', () => {
  //   cy.loadStory(['Advanced', 'Reactive props', 'Reactive field rule'])

  //   /**
  //    * Properly validates the reactive field when its value changes.
  //    */
  //   cy.getField('fieldOne').typeIn('bar')
  //   cy.getField('fieldTwo')
  //     .valid(false)
  //     .invalid(false)
  //     .typeIn('foo')
  //     .should('have.class', 'is-invalid')
  //     .clear()
  //     .valid(false)
  //     .invalid(false)
  //     .typeIn('bar')
  //     .expected()

  //   /**
  //    * Properly vaidated the reactive field when the value of the
  //    * referenced field changes.
  //    */
  //   cy.getField('fieldTwo')
  //     .clear()
  //     .typeIn('bars')
  //     .expected(false)
  //   cy.getField('fieldOne')
  //     .clear()
  //     .typeIn('bars')
  //   cy.getField('fieldTwo').expected()
  // })
})
