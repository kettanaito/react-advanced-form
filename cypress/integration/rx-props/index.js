import React from 'react';
import { mount } from 'cypress-react-unit-test';
import BasicScenario from '@scenarios/RxProps/Basic';
import DelegatedScenario from '@scenarios/RxProps/Delegated';
import InterdependentScenario from '@scenarios/RxProps/Interdependent';

describe('Reactive props', function () {
  it('Direct field subscription', () => {
    mount(<BasicScenario />);

    cy.get('[name="fieldTwo"]').should('have.attr', 'required');
    cy.get('[name="fieldTwo"]')
      .focus().blur()
      .should('have.class', 'invalid');

    cy.get('[name="fieldOne"]').clear();
    cy.get('[name="fieldTwo"]').should('not.have.attr', 'required');
  });

  it('Delegated field subscription', () => {
    mount(<DelegatedScenario />);

    cy.get('[name="fieldOne"]').should('have.attr', 'required');
    cy.get('[name="fieldOne"]')
      .focus().blur()
      .should('have.class', 'invalid');

    cy.get('[name="fieldTwo"]').clear();
    cy.get('[name="fieldOne"]').should('not.have.attr', 'required');
  });

  it('Inter-dependent fields', () => {
    mount(<InterdependentScenario />);

    cy.get('[name="fieldOne"]').should('not.have.attr', 'required');
    cy.get('[name="fieldTwo"]').should('not.have.attr', 'required');

    cy.get('[name="fieldOne"]').type('foo').should('have.value', 'foo');
    cy.get('[name="fieldTwo"]').should('have.attr', 'required');
    cy.get('[name="fieldOne"]').clear();
    cy.get('[name="fieldTwo"]').should('not.have.attr', 'required');

    cy.get('[name="fieldTwo"]').type('doe').should('have.value', 'doe');
    cy.get('[name="fieldOne"]').should('have.attr', 'required');
    cy.get('[name="fieldTwo"]').clear();
    cy.get('[name="fieldOne"]').should('not.have.attr', 'required');

    cy.get('[name="fieldOne"]').type('foo').should('have.value', 'foo');
    cy.get('[name="fieldTwo"]').type('doe').should('have.value', 'doe');
    cy.get('[name="fieldOne"]').should('have.attr', 'required');
    cy.get('[name="fieldTwo"]').should('have.attr', 'required');

    cy.get('[name="fieldOne"]').clear();
    cy.get('[name="fieldTwo"]').clear();
    cy.get('[name="fieldOne"]').should('not.have.attr', 'required');
    cy.get('[name="fieldTwo"]').should('not.have.attr', 'required');
  });
});
