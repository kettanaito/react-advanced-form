import React from 'react';
import { mount } from 'cypress-react-unit-test';
import Scenario from '@scenarios/FormProvider/DebounceTime';

describe('FormProvider', function () {
  before(() => mount(<Scenario />));

  it('debounceTime: Propagates default value', () => {
    cy.get('#fieldOne').type('fo').should('have.class', 'invalid')
      .type('o').should('have.class', 'invalid')
      .wait(250).should('have.class', 'valid');
  });

  it('debounceTime: Supports custom value', () => {
    cy.get('#fieldTwo').type('fo').should('have.class', 'invalid')
      .type('o').wait(0).should('not.have.class', 'invalid')
      .should('have.class', 'valid');
  });
});
