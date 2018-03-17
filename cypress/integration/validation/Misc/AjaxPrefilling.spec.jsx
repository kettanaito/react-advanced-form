import React from 'react';
import { mount } from 'cypress-react-unit-test';
import Scenario, { timeoutDuration } from '@examples/validation/AjaxPrefilling';

describe('AJAX Pre-filling', function () {
  before(() => {
    mount(<Scenario />);
    cy.get('#ajax').click().wait(timeoutDuration);
  });

  it('Pre-fills value properly', () => {
    cy.get('[name="street"]')
      .should('have.value', 'Baker')
      .should('have.class', 'is-valid');
  });

  it('Validates pre-filled value properly', () => {
    cy.get('[name="streetRule"]')
      .should('have.value', 'Baker')
      .should('have.class', 'is-invalid');
  });
});
