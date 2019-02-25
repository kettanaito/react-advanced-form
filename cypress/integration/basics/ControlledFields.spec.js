import { expect } from 'chai'

describe('Controlled fields', function() {
  before(() => {
    cy.loadStory(['Basics', 'Interaction', 'Controlled fields'])
  })

  afterEach(() => {
    cy.log('Reset form')
      .window()
      .then(($window) => {
        $window.form.reset()
      })
  })

  it('Mounts with proper initial state', () => {
    cy.window().should(($window) => {
      const serialized = $window.form.serialize()

      expect(serialized).to.deep.equal({
        inputTwo: 'foo',
        select: 'two',
        radio: 'potato',
        checkbox1: false,
        checkbox2: true,
        textareaTwo: 'something',
      })
    })
  })

  it('Updates form state on field change', () => {
    cy.get('#inputOne').typeIn('first value')
    cy.get('#inputTwo')
      .clear()
      .typeIn('second value')
    cy.get('#radio3')
      .markChecked()
      .should('be.checked')
    cy.get('#checkbox1')
      .markChecked()
      .should('be.checked')
    cy.get('#checkbox2').markUnchecked()
    cy.get('#select').select('three')
    cy.get('#textareaOne')
      .clear()
      .typeIn('foo')
    cy.get('#textareaTwo')
      .clear()
      .typeIn('another')

    cy.getField('inputOne').hasValue('first value')
    cy.getField('inputTwo').hasValue('second value')
    cy.getField('radio').hasValue('cucumber')
    cy.getField('checkbox1').hasValue(true)
    cy.getField('checkbox2').hasValue(false)
    cy.getField('select').hasValue('three')
    cy.getField('textareaOne').hasValue('foo')
    cy.getField('textareaTwo').hasValue('another')

    // cy.window().then(($window) => {
    //   const serialized = $window.form.serialize()

    //   return expect(serialized).to.deep.equal({
    //     inputOne: 'first value',
    //     inputTwo: 'second value',
    //     radio: 'cucumber',
    //     checkbox1: true,
    //     checkbox2: false,
    //     select: 'three',
    //     textareaOne: 'foo',
    //     textareaTwo: 'another',
    //   })
    // })
  })

  it.only('Supports value update derived from state update', () => {
    cy.get('#update-button').click()

    cy.getField('inputOne').hasValue('foo')
    cy.getField('inputTwo').hasValue('bar')
    cy.getField('checkbox1').should('be.checked')
    cy.getField('checkbox2').should('not.ßbe.checked')
    cy.getField('textareaOne').hasValue('third')
  })
})
