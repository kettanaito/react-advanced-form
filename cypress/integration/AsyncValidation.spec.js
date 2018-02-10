import React from 'react';
import { mount } from 'cypress-react-unit-test';
import AsyncValidation from './scenarios/AsyncValidation';

describe('Asynchronous validation', function () {
  beforeEach(() => {
    mount(<AsyncValidation />);
  });

  describe('Logic', () => {
    it('empty optional field with async rule resolves', () => {
      const fieldSelector = '[name="fieldOne"]';
      cy.get(fieldSelector)
        .focus()
        .blur()
        .should('not.have.class', 'valid')
        .should('not.have.class', 'invalid');
    });

    it('empty required field with async rule rejects', () => {
      mount(<AsyncValidation required />);

      const fieldSelector = '[name="fieldOne"]';
      cy.get(fieldSelector)
        .focus()
        .blur()
        .should('not.have.class', 'valid')
        .should('have.class', 'invalid');
    });

    it('field with expected value resolves', () => {
      const fieldSelector = '[name="fieldOne"]';
      cy.get(fieldSelector)
        // .focus()
        .type('expected value').should('have.value', 'expected value')
        .blur().should('have.class', 'validating')
        .wait(500)
        .should('not.have.class', 'validating')
        .should('have.class', 'valid');
    });

    it('field with unexpected value rejects', () => {
      const fieldSelector = '[name="fieldOne"]';
      cy.get(fieldSelector)
        // .focus()
        .type('foo').should('have.value', 'foo')
        .blur().should('have.class', 'validating')
        .wait(500)
        .should('not.have.class', 'validating')
        .should('have.class', 'invalid');
    });

    it('cancels pending async validation on state reset', () => {
      const fieldSelector = '[name="fieldOne"]';
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
      mount(<AsyncValidation extra="extra string" />);

      const fieldSelector = '[name="fieldOne"]';

      cy.get(fieldSelector)
        .type('foo').should('have.value', 'foo')
        .blur().should('have.class', 'validating')
        .wait(500)
        .should('not.have.class', 'validating')
        .should('have.attr', 'data-errors', 'extra string');
    });
  });
});
