import React from 'react';
import { expect } from 'chai';
import { mount } from 'cypress-react-unit-test';
import Scenario from '@scenarios/Basics/Interactions';
import ScenarioControlled from '@scenarios/Basics/Interactions.controlled';

describe('Interactions', function () {
  beforeEach(() => {
    mount(<Scenario getRef={ form => this.form = form } />);
  });

  it('uncontrolled fields render with proper form state', () => {
    cy.get('#form').should(() => {
      const serialized = this.form.serialize();
      expect(serialized).to.deep.equal({
        inputTwo: 'foo',
        select: 'two',
        radio: 'potato',
        textareaTwo: 'Something'
      });
    });
  });

  it('uncontrolled fields interactions change form state properly', () => {
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
    mount(<ScenarioControlled />);
  });
});
