import React from 'react';
import { mount } from 'cypress-react-unit-test';
import Scenario from '@scenarios/SyncValidation/Field.props.rule';

describe('Field.props.rule', function () {
  before(() => {
    mount(<Scenario getRef={ form => this.form = form } />);
  });

  afterEach(() => this.form.reset());

  it('empty optional field with sync rule resolves', () => {
    cy.get('#fieldOne')
      .focus()
      .blur()
      .should('not.have.class', 'form-control-success')
      .should('not.have.class', 'form-control-danger');
  });

  it('empty required field with sync rule rejects', () => {
    cy.get('#fieldTwo')
      .focus()
      .blur()
      .should('not.have.class', 'form-control-success')
      .should('have.class', 'form-control-danger')
  });

  it('filled optional field with matching value resolves', () => {
    cy.get('#fieldOne')
      .type('123').should('have.value', '123')
      .blur()
      .should('have.class', 'form-control-success')
      .should('not.have.class', 'form-control-danger')
  });

  it('filled optional field with unmatching value rejects', () => {
    cy.get('#fieldOne')
      .type('foo').should('have.value', 'foo')
      .blur()
      .should('have.class', 'form-control-danger')
      .should('not.have.class', 'form-control-success')
  });

  it('filled required field with matching value resolves', () => {
    cy.get('#fieldTwo')
      .type('123').should('have.value', '123')
      .blur()
      .should('have.class', 'form-control-success')
      .should('not.have.class', 'form-control-danger');
  });

  it('filled required field with unmatching value rejects', () => {
    cy.get('#fieldTwo')
      .type('foo').should('have.value', 'foo')
      .blur()
      .should('have.class', 'form-control-danger')
      .should('not.have.class', 'form-control-success');
  });
});
