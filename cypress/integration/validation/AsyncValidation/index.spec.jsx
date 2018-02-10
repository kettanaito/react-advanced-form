import React from 'react';
import { mount } from 'cypress-react-unit-test';
import Scenario, { fieldSelector } from '@scenarios/AsyncValidation/Field.props.asyncRule';

describe('Asynchronous validation', function () {
  beforeEach(() => {
    mount(<Scenario />);
  });

  describe('Logic', () => {
    it('empty optional field with async rule resolves', () => {
      cy.get(fieldSelector)
        .focus()
        .blur()
        .should('not.have.class', 'valid')
        .should('not.have.class', 'invalid');
    });

    it('empty required field with async rule rejects', () => {
      mount(<Scenario required />);

      cy.get(fieldSelector)
        .focus()
        .blur()
        .should('have.attr', 'data-validated-async', 'false')
        .should('have.attr', 'data-valid-async', 'false')
        .should('not.have.class', 'valid')
        .should('have.class', 'invalid');
    });

    it('field with rejected sync rule does not call async rule', () => {
      mount(<Scenario rule={/^\d+$/} />);

      cy.get(fieldSelector)
        .type('foo').should('have.value', 'foo')
        .should('have.attr', 'data-validated-sync', 'true')
        .should('have.attr', 'data-valid-sync', 'false')
        .should('have.attr', 'data-validated-async', 'false')
        .should('have.attr', 'data-valid-async', 'false')
        .should('have.class', 'invalid')
    });

    it('field with expected value resolves', () => {
      cy.get(fieldSelector)
        .type('expected value').should('have.value', 'expected value')
        .blur().should('have.class', 'validating')
        .wait(500)
        .should('not.have.class', 'validating')
        .should('have.class', 'valid');
    });

    it('field with unexpected value rejects', () => {
      cy.get(fieldSelector)
        .type('foo').should('have.value', 'foo')
        .blur().should('have.class', 'validating')
        .wait(500)
        .should('not.have.class', 'validating')
        .should('have.class', 'invalid');
    });

    it('cancels pending async validation on state reset', () => {
      cy.get(fieldSelector)
        .type('foo').should('have.value', 'foo')
        .blur({ force: true }).should('have.class', 'validating')
        .wait(250)
        .clear()
        .should('not.have.class', 'validating')
        .should('not.have.class', 'invalid')
        .type('expected value')
        .blur({ force: true }).should('have.class', 'validating')
        .wait(500)
        .should('not.have.class', 'validating')
        .should('have.class', 'valid');
    });
  });

  describe('Messages', () => {
    it('error message can access "extra" received from response', () => {
      mount(<Scenario extra="extra string" />);

      cy.get(fieldSelector)
        .type('foo').should('have.value', 'foo')
        .blur().should('have.class', 'validating')
        .wait(500)
        .should('not.have.class', 'validating')
        .should('have.attr', 'data-errors', 'extra string');
    });
  });
});
