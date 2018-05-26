import React from 'react'
import { expect } from 'chai'
import Scenario from '@examples/basics/UncontrolledFields'

describe('Uncontrolled fields interactions', function() {
  before(() => {
    cy.loadStory(<Scenario getRef={(form) => (this.form = form)} />)
  })

  afterEach(() => {
    this.form.reset()
  })

  it('Form renders with proper initial state.fields values', () => {
    cy.get('#form').should(() => {
      const serialized = this.form.serialize()
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

  it('Fields interactions change form state properly', () => {
    cy.get('#inputOne').type('first value')
    cy
      .get('#inputTwo')
      .clear()
      .type('second value')
    cy.get('#radio3').check({ force: true })
    cy
      .get('#checkbox1')
      .check({ force: true })
      .should('be.checked')
    cy
      .get('#checkbox2')
      .uncheck({ force: true })
      .should('not.be.checked')
    cy.get('#select').select('three')
    cy
      .get('#textareaOne')
      .clear()
      .type('foo')
    cy
      .get('#textareaTwo')
      .clear()
      .type('another')
    cy.then(() => {
      const serialized = this.form.serialize()
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
