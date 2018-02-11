import React from 'react';
import { expect } from 'chai';
import { mount } from 'cypress-react-unit-test';
import Scenario from '@scenarios/Basics/Interactions';
import ScenarioControlled from '@scenarios/Basics/Interactions.controlled';

describe('Interactions', function () {
  it('uncontrolled fields render with proper form state', () => {
    mount(<Scenario getRef={ form => this.form = form } />);

    cy.get('#form').should(() => {
      const serialized = this.form.serialize();
      expect(serialized).to.deep.equal({
        inputTwo: 'foo',
        select: 'two',
        radio: 'potato',
        textareaTwo: 'something'
      });
    });
  });

  it('uncontrolled fields interactions change form state properly', () => {
    mount(<Scenario getRef={ form => this.form = form } />);

    cy.get('[name="inputOne"]').type('first value');
    cy.get('[name="inputTwo"]').clear().type('second value')
    cy.get('#radio3').check();
    cy.get('[name="select"]').select('three');
    cy.get('[name="textareaOne"]').clear().type('foo');
    cy.get('[name="textareaTwo"]').clear().type('another');
    cy.then(() => {
        const serialized = this.form.serialize();
        expect(serialized).to.deep.equal({
          inputOne: 'first value',
          inputTwo: 'second value',
          radio: 'cucumber',
          select: 'three',
          textareaOne: 'foo',
          textareaTwo: 'another'
        });
      });
  });

  it('controlled fields render with proper form state', () => {
    mount(<ScenarioControlled getRef={ form => this.form = form } />);

    cy.get('#form').should(() => {
      const serialized = this.form.serialize();
      expect(serialized).to.deep.equal({
        inputTwo: 'foo',
        select: 'two',
        radio: 'potato',
        textareaTwo: 'something'
      });
    });
  });

  it('controlled fields interactions change form state properly', () => {
    mount(<ScenarioControlled getRef={ form => this.form = form } />);

    cy.get('[name="inputOne"]').type('first value').should('have.value', 'first value');
    cy.get('[name="inputTwo"]').clear().type('second value').should('have.value', 'second value');
    cy.get('#radio3').check().should('be.checked');
    cy.get('[name="select"]').select('three');
    cy.get('[name="textareaOne"]').clear().type('foo').should('have.value', 'foo');
    cy.get('[name="textareaTwo"]').clear().type('another').should('have.value', 'another');
    cy.then(() => {
      const serialized = this.form.serialize();
      console.log(serialized);

      return expect(serialized).to.deep.equal({
        inputOne: 'first value',
        inputTwo: 'second value',
        radio: 'cucumber',
        select: 'three',
        textareaOne: 'foo',
        textareaTwo: 'another'
      });
    });
  });
});
