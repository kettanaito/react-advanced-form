import React from 'react';
import { mount } from 'cypress-react-unit-test';
import Scenario from '@examples/validation/SyncValidation/Field.props.rule';

describe('Field.props.rule', function () {
  before(() => mount(<Scenario getRef={ form => this.form = form } />));
  afterEach(() => this.form.reset());

  it('Empty optional field with sync rule resolves', () => {
    cy.get('#fieldOne')
      .focus()
      .blur()
      .should('not.have.class', 'is-valid')
      .should('not.have.class', 'is-invalid');
  });

  it('Empty required field with sync rule rejects', () => {
    cy.get('#fieldTwo')
      .focus()
      .blur()
      .should('not.have.class', 'is-valid')
      .should('have.class', 'is-invalid')
  });

  it('Filled optional field with matching value resolves', () => {
    cy.get('#fieldOne')
      .type('123').should('have.value', '123')
      .blur()
      .should('have.class', 'is-valid')
      .should('not.have.class', 'is-invalid')
  });

  it('Filled optional field with unmatching value rejects', () => {
    cy.get('#fieldOne')
      .type('foo').should('have.value', 'foo')
      .blur()
      .should('have.class', 'is-invalid')
      .should('not.have.class', 'is-valid')
  });

  it('Filled required field with matching value resolves', () => {
    cy.get('#fieldTwo')
      .type('foo').should('have.value', 'foo')
      .blur()
      .should('have.class', 'is-valid')
      .should('not.have.class', 'is-invalid');
  });

  it('Filled required field with unmatching value rejects', () => {
    cy.get('#fieldTwo')
      .type('123').should('have.value', '123')
      .blur()
      .should('have.class', 'is-invalid')
      .should('not.have.class', 'is-valid');
  });
});
