import React from 'react'
import { expect } from 'chai'

describe('Uncontrolled fields', function() {
  before(() => {
    cy._loadStory(['Basics', 'Interaction', 'Uncontrolled fields'])
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
    cy.get('#inputOne').type('first value')
    cy.get('#inputTwo')
      .clear()
      .typeIn('second value')
    cy.get('#radio3').markChecked()
    cy.get('#checkbox1').markChecked()
    cy.get('#checkbox2').markUnchecked()
    cy.get('#select').select('three')
    cy.get('#textareaOne')
      .clear()
      .typeIn('foo')
    cy.get('#textareaTwo')
      .clear()
      .typeIn('another')

    cy.window(($window) => {
      const serialized = $window.form.serialize()
      expect(serialized).to.deep.equal({
        inputOne: 'first value',
        inputTwo: 'second value',
        radio: 'cucumber',
        checkbox1: true,
        checkbox2: false,
        select: 'three',
        textareaOne: 'foo',
        textareaTwo: 'another',
      })
    })
  })
})
