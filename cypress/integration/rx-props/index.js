import React from 'react';
import { mount } from 'cypress-react-unit-test';
import BasicScenario from '@scenarios/RxProps/Basic';
import DelegatedScenario from '@scenarios/RxProps/Delegated';
import InterdependentScenario from '@scenarios/RxProps/Interdependent';
import OneTargetScenario from '@scenarios/RxProps/OneTarget';

describe('Reactive props', function () {
  it('Direct field subscription', () => {
    mount(<BasicScenario />);

    cy.get('[name="fieldTwo"]').should('have.attr', 'required');
    cy.get('[name="fieldTwo"]')
      .focus().blur()
      .should('have.class', 'is-invalid');

    cy.get('[name="fieldOne"]').clear();
    cy.get('[name="fieldTwo"]')
      .should('not.have.attr', 'required')
      .should('not.have.class', 'is-invalid');
  });

  it('Delegated field subscription', () => {
    mount(<DelegatedScenario />);

    cy.get('[name="fieldOne"]').should('have.attr', 'required');
    cy.get('[name="fieldOne"]')
      .focus().blur()
      .should('have.class', 'is-invalid');

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

  it('Multiple fields depending on one target', () => {
    mount(<OneTargetScenario />);

    cy.get('[name="fieldOne"]').should('not.have.attr', 'required');
    cy.get('[name="fieldThree"]').should('not.have.attr', 'required');

    cy.get('[name="fieldTwo"]').type('foo').should('have.value', 'foo');
    cy.get('[name="fieldOne"]')
      .should('have.class', 'is-invalid')
      .should('have.attr', 'required');
    cy.get('[name="fieldThree"]')
      .should('have.class', 'is-invalid')
      .should('have.attr', 'required');

    cy.get('[name="fieldOne"]').type('foo')
      .should('have.value', 'foo')
      .should('have.class', 'is-valid');

    cy.get('[name="fieldThree"]').type('doe')
      .should('have.value', 'doe')
      .should('have.class', 'is-valid');

    cy.get('[name="fieldTwo"]').clear().should('not.have.value');
    cy.get('[name="fieldOne"]')
      .should('not.have.class', 'is-invalid')
      .should('not.have.class', 'is-valid')
      .should('not.have.attr', 'required');
    cy.get('[name="fieldThree"]')
      .should('not.have.class', 'is-invalid')
      .should('not.have.class', 'is-valid')
      .should('not.have.attr', 'required');
  });
});
