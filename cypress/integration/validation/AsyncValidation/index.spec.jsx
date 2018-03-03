import React from 'react';
import { mount } from 'cypress-react-unit-test';
import Scenario, { fieldSelector } from '@scenarios/AsyncValidation/Field.props.asyncRule';

describe('Asynchronous validation', function () {
  before(() => {
    mount(<Scenario getRef={ form => this.form = form } />);
  });

  afterEach(() => this.form.reset());

  describe('Logic', () => {
    it('empty optional field with async rule resolves', () => {
      cy.get('#fieldOne')
        .focus()
        .blur()
        .should('not.have.class', 'is-valid')
        .should('not.have.class', 'is-invalid');
    });

    it('empty required field with async rule rejects', () => {
      cy.get('#fieldTwo')
        .focus()
        .blur()
        .should('not.have.class', 'is-valid')
        .should('have.class', 'is-invalid');
    });

    it('field with rejected sync rule does not call async rule', () => {
      cy.get('#fieldThree')
        .type('foo').should('have.value', 'foo')
        .should('have.class', 'is-invalid');
    });

    it('field with expected value resolves', () => {
      cy.get('#fieldOne')
        .type('expected value').should('have.value', 'expected value')
        .blur().should('have.class', 'is-validating')
        .wait(500)
        .should('not.have.class', 'is-validating')
        .should('have.class', 'is-valid');
    });

    it('field with unexpected value rejects', () => {
      cy.get('#fieldOne')
        .type('foo').should('have.value', 'foo')
        .blur().should('have.class', 'is-validating')
        .wait(500)
        .should('not.have.class', 'is-validating')
        .should('have.class', 'is-invalid');
    });

    it('cancels pending async validation on state reset', () => {
      cy.get('#fieldOne')
        .type('foo').should('have.value', 'foo')
        .blur({ force: true }).should('have.class', 'is-validating')
        .wait(250)
        .clear()
        .should('not.have.class', 'is-validating')
        .should('not.have.class', 'is-invalid')
        .type('expected value')
        .blur({ force: true }).should('have.class', 'is-validating')
        .wait(500)
        .should('not.have.class', 'is-validating')
        .should('have.class', 'is-valid');
    });
  });

  describe('Messages', () => {
    it('error message can access "extra" received from response', () => {
      cy.get('#fieldFour')
        .type('foo').should('have.value', 'foo')
        .blur().should('have.class', 'is-validating')
        .wait(500)
        .should('not.have.class', 'is-validating');
    });
  });
});
