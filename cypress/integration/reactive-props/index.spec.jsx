import React from 'react';
import { mount } from 'cypress-react-unit-test';
import DynamicRequired from '@examples/reactive-props/DynamicRequired';
import DelegatedScenario from '@examples/reactive-props/DelegatedSubscription';
import InterdependentScenario from '@examples/reactive-props/Interdependent';
import SingleTargetScenario from '@examples/reactive-props/SingleTarget';

describe('Reactive props', function () {
  it('Direct field subscription', () => {
    mount(<DynamicRequired />);

    cy.get('[name="lastName"]').should('have.attr', 'required');
    cy.get('[name="lastName"]')
      .focus().blur()
      .should('have.class', 'is-invalid');

    cy.get('[name="firstName"]').clear();
    cy.get('[name="lastName"]')
      .should('not.have.attr', 'required')
      .should('not.have.class', 'is-invalid');
  });

  it('Delegated field subscription', () => {
    mount(<DelegatedScenario />);

    cy.get('[name="firstName"]').should('have.attr', 'required');
    cy.get('[name="firstName"]')
      .focus().blur()
      .should('have.class', 'is-invalid');

    cy.get('[name="lastName"]').clear();
    cy.get('[name="firstName"]').should('not.have.attr', 'required');
  });

  it('Inter-dependent fields', () => {
    mount(<InterdependentScenario />);

    cy.get('[name="firstName"]').should('not.have.attr', 'required');
    cy.get('[name="lastName"]').should('not.have.attr', 'required');

    cy.get('[name="firstName"]').type('foo').should('have.value', 'foo');
    cy.get('[name="lastName"]').should('have.attr', 'required');
    cy.get('[name="firstName"]').clear();
    cy.get('[name="lastName"]').should('not.have.attr', 'required');

    cy.get('[name="lastName"]').type('doe').should('have.value', 'doe');
    cy.get('[name="firstName"]').should('have.attr', 'required');
    cy.get('[name="lastName"]').clear();
    cy.get('[name="firstName"]').should('not.have.attr', 'required');

    cy.get('[name="firstName"]').type('foo').should('have.value', 'foo');
    cy.get('[name="lastName"]').type('doe').should('have.value', 'doe');
    cy.get('[name="firstName"]').should('have.attr', 'required');
    cy.get('[name="lastName"]').should('have.attr', 'required');

    cy.get('[name="firstName"]').clear();
    cy.get('[name="lastName"]').clear();
    cy.get('[name="firstName"]').should('not.have.attr', 'required');
    cy.get('[name="lastName"]').should('not.have.attr', 'required');
  });

  it('Multiple fields depending on one target', () => {
    mount(<SingleTargetScenario />);

    cy.get('[name="firstName"]').should('not.have.attr', 'required');
    cy.get('[name="fieldThree"]').should('not.have.attr', 'required');

    cy.get('[name="lastName"]')
      .type('foo').should('have.value', 'foo');
    cy.get('[name="firstName"]')
      .should('have.class', 'is-invalid')
      .should('have.attr', 'required');
    cy.get('[name="fieldThree"]')
      .should('have.class', 'is-invalid')
      .should('have.attr', 'required');

    cy.get('[name="firstName"]')
      .type('foo').should('have.value', 'foo')
      .should('have.class', 'is-valid');

    cy.get('[name="fieldThree"]')
      .type('doe').should('have.value', 'doe')
      .should('have.class', 'is-valid');

    cy.get('[name="lastName"]')
      .clear()
      .should('not.have.value');
    cy.get('[name="firstName"]')
      .should('not.have.class', 'is-invalid')
      .should('not.have.class', 'is-valid')
      .should('not.have.attr', 'required');
    cy.get('[name="fieldThree"]')
      .should('not.have.class', 'is-invalid')
      .should('not.have.class', 'is-valid')
      .should('not.have.attr', 'required');
  });
});
