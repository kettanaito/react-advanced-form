import React from 'react';
import { mount } from 'cypress-react-unit-test';
import Scenario, { fieldSelector } from '@scenarios/SyncValidation/Form.props.rules';

describe('Form.props.rules', function () {
  before(() => {
    mount(<Scenario />);
  });

  it('empty optional field with Form.props.rules resolves', () => {
    cy.get(fieldSelector)
      .focus()
      .blur()
      .should('not.have.class', 'valid')
      .should('not.have.class', 'invalid');
  });

  it('clearing optional unexpected field resets validation status', () => {
    cy.get(fieldSelector)
      .clear().type('foo').should('have.value', 'foo')
      .should('have.class', 'invalid')
      .clear()
      .should('not.have.class', 'invalid')
      .should('not.have.class', 'valid');
  });

  it('clearing required unexpected field retains validation status', () => {
    mount(<Scenario required />);

    cy.get(fieldSelector)
      .clear().type('foo').should('have.value', 'foo')
      .should('have.class', 'invalid')
      .clear()
      .should('have.class', 'invalid')
      .should('not.have.class', 'valid');
  });

  it('optional field with name-specific matching value resolves', () => {
    cy.get(fieldSelector)
      .clear().type('some').should('have.value', 'some')
      .should('have.class', 'valid')
      .should('not.have.class', 'invalid');
  });

  it('optional field with name-specific unmatching value rejects', () => {
    cy.get(fieldSelector)
      .clear().type('foo').should('have.value', 'foo')
      .should('have.class', 'invalid')
      .should('not.have.class', 'valid');
  });

  it('optional field with type-specific matching value resolves', () => {
    cy.get(fieldSelector)
      .clear().type('some').should('have.value', 'some')
      .should('have.class', 'valid')
      .should('not.have.class', 'invalid');
  });

  it('optional field with type-specific unmatching value rejects', () => {
    cy.get(fieldSelector)
      .clear().type('123').should('have.value', '123')
      .should('have.class', 'invalid')
      .should('not.have.class', 'valid');
  });

  it('required field with name-specific matching value resolves', () => {
    mount(<Scenario required />);

    cy.get(fieldSelector)
      .clear().type('some').should('have.value', 'some')
      .should('have.class', 'valid')
      .should('not.have.class', 'invalid');
  });

  it('required field with name-specific unmatching value rejects', () => {
    mount(<Scenario required />);

    cy.get(fieldSelector)
      .clear().type('foo').should('have.value', 'foo')
      .should('have.class', 'invalid')
      .should('not.have.class', 'valid');
  });
});
