import React from 'react';
import { mount } from 'cypress-react-unit-test';
import Scenario from '@scenarios/Components/FormProvider/DebounceTime';

describe('FormProvider', function () {
  before(() => mount(<Scenario />));

  it('debounceTime: Propagates default value', () => {
    cy.get('#fieldOne').type('fo').should('have.class', 'form-control-danger')
      .type('o').should('have.class', 'form-control-danger')
      .wait(250).should('have.class', 'form-control-success');
  });

  it('debounceTime: Supports custom value', () => {
    cy.get('#fieldTwo').type('fo').should('have.class', 'form-control-danger')
      .type('o').wait(0).should('not.have.class', 'form-control-danger')
      .should('have.class', 'form-control-success');
  });
});
