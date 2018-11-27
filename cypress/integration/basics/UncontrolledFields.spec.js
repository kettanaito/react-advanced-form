import { expect } from 'chai'

describe('Uncontrolled fields', function() {
  before(() => {
    cy.loadStory(['Basics', 'Interaction', 'Uncontrolled fields'])
  })

  it('Mounts with proper initial state', () => {
    cy.window().should(($window) => {
      const serialized = $window.form.serialize()
      expect(serialized).to.deep.equal({
        inputTwo: 'foo',
        select: 'two',
        radio: 'potato',
        checkboxOne: false,
        checkboxTwo: true,
        textareaTwo: 'something',
      })
    })
  })

  it('Updates form state on field change', () => {
    cy.getField('inputOne').type('first value')
    cy.getField('inputTwo')
      .clear()
      .typeIn('second value')
    cy.get('#radio3').markChecked()
    cy.getField('checkboxOne').markChecked()
    cy.getField('checkboxTwo').markUnchecked()
    cy.getField('select').select('three')
    cy.getField('textareaOne')
      .clear()
      .typeIn('foo')
    cy.getField('textareaTwo')
      .clear()
      .typeIn('another')

    cy.window(($window) => {
      const serialized = $window.form.serialize()
      expect(serialized).to.deep.equal({
        inputOne: 'first value',
        inputTwo: 'second value',
        radio: 'cucumber',
        checkboxOne: true,
        checkboxTwo: false,
        select: 'three',
        textareaOne: 'foo',
        textareaTwo: 'another',
      })
    })
  })
})
