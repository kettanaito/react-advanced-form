import React from 'react';
import { expect } from 'chai';
import { mount } from 'cypress-react-unit-test';
import Scenario from '@scenarios/Basics/InteractionsUncontrolled';

describe('Uncontrolled fields interactions', function () {
  before(() => {
    mount(<Scenario getRef={ form => this.form = form } />);
  });

  afterEach(() => {
    this.form.reset();
  });

  it('form renders with proper initial state.fields values', () => {
    cy.get('#form').should(() => {
      const serialized = this.form.serialize();
      expect(serialized).to.deep.equal({
        inputTwo: 'foo',
        select: 'two',
        radio: 'potato',
        checkbox1: false,
        checkbox2: true,
        textareaTwo: 'something'
      });
    });
  });

  it('fields interactions change form state properly', () => {
    cy.get('#inputOne').type('first value');
    cy.get('#inputTwo').clear().type('second value')
    cy.get('#radio3').check();
    cy.get('#checkbox1').check().should('be.checked');
    cy.get('#checkbox2').uncheck().should('not.be.checked');
    cy.get('#select').select('three');
    cy.get('#textareaOne').clear().type('foo');
    cy.get('#textareaTwo').clear().type('another');
    cy.then(() => {
        const serialized = this.form.serialize();
        expect(serialized).to.deep.equal({
          inputOne: 'first value',
          inputTwo: 'second value',
          radio: 'cucumber',
          checkbox1: true,
          checkbox2: false,
          select: 'three',
          textareaOne: 'foo',
          textareaTwo: 'another'
        });
      });
  });
});
