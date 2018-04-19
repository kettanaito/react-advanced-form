import React from 'react';
import { mount } from 'cypress-react-unit-test';
import Scenario, { fieldSelector } from '@examples/validation/SyncValidation/Form.props.rules';

describe('Form.props.rules', function () {
  before(() => mount(<Scenario />));

  it('Empty optional field with Form.props.rules resolves', () => {
    cy.get(fieldSelector)
      .focus()
      .blur()
      .should('not.have.class', 'is-valid')
      .should('not.have.class', 'is-invalid')
  });

  it('Clearing optional unexpected field resets validation status', () => {
    cy.get(fieldSelector)
      .clear().type('foo').should('have.value', 'foo')
      .should('have.class', 'is-invalid')
      .clear()
      .should('not.have.class', 'is-invalid')
      .should('not.have.class', 'is-valid')
  });

  it('Clearing required unexpected field retains validation status', () => {
    mount(<Scenario required />);

    cy.get(fieldSelector)
      .clear().type('foo').should('have.value', 'foo')
      .should('have.class', 'is-invalid')
      .clear()
      .should('have.class', 'is-invalid')
      .should('not.have.class', 'is-valid')
  });

  it('Optional field with name-specific matching value resolves', () => {
    cy.get(fieldSelector)
      .clear().type('some').should('have.value', 'some')
      .should('have.class', 'is-valid')
      .should('not.have.class', 'is-invalid')
  });

  it('Optional field with name-specific unmatching value rejects', () => {
    cy.get(fieldSelector)
      .clear().type('foo').should('have.value', 'foo')
      .should('have.class', 'is-invalid')
      .should('not.have.class', 'is-valid')
  });

  it('Optional field with type-specific matching value resolves', () => {
    cy.get(fieldSelector)
      .clear().type('some').should('have.value', 'some')
      .should('have.class', 'is-valid')
      .should('not.have.class', 'is-invalid')
  });

  it('Optional field with type-specific unmatching value rejects', () => {
    cy.get(fieldSelector)
      .clear().type('123').should('have.value', '123')
      .should('have.class', 'is-invalid')
      .should('not.have.class', 'is-valid')
  });

  it('Required field with name-specific matching value resolves', () => {
    mount(<Scenario required />);

    cy.get(fieldSelector)
      .clear().type('some').should('have.value', 'some')
      .should('have.class', 'is-valid')
      .should('not.have.class', 'is-invalid')
  });

  it('Required field with name-specific unmatching value rejects', () => {
    mount(<Scenario required />);

    cy.get(fieldSelector)
      .clear().type('foo').should('have.value', 'foo')
      .should('have.class', 'is-invalid')
      .should('not.have.class', 'is-valid')
  });

  it('Re-evaluates rule when referenced field prop updates', () => {
    cy.get('[name="fieldOne"]')
      .clear()
      .type('something').should('have.value', 'something')

    cy.get('[name="fieldTwo"]')
      .type('foo').should('have.value', 'foo')
      .should('have.class', 'is-invalid')
      .clear()
      .type('something').should('have.value', 'something')
      .should('have.class', 'is-valid')
    });
});
