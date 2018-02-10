import React from 'react';
import { mount } from 'cypress-react-unit-test';
import Scenario, { fieldSelector } from '@scenarios/SyncValidation/Field.props.rule';

describe('Field.props.rule', function () {
  it('empty optional field with sync rule resolves', () => {
    mount(<Scenario />);

    cy.get(fieldSelector)
      .focus()
      .blur()
      .should('not.have.class', 'valid')
      .should('not.have.class', 'invalid');
  });

  it('empty required field with sync rule rejects', () => {
    mount(<Scenario required />);

    cy.get(fieldSelector)
      .focus()
      .blur()
      .should('not.have.class', 'valid')
      .should('have.class', 'invalid')
  });

  it('filled optional field with matching value resolves', () => {
    mount(<Scenario />);

    cy.get(fieldSelector)
      .type('123').should('have.value', '123')
      .blur()
      .should('have.class', 'valid')
      .should('not.have.class', 'invalid')
  });

  it('filled optional field with unmatching value rejects', () => {
    mount(<Scenario />);

    cy.get(fieldSelector)
      .type('foo').should('have.value', 'foo')
      .blur()
      .should('have.class', 'invalid')
      .should('not.have.class', 'valid')
  });

  it('filled required field with matching value resolves', () => {
    mount(<Scenario required />);

    cy.get(fieldSelector)
    .type('123').should('have.value', '123')
    .blur()
    .should('have.class', 'valid')
    .should('not.have.class', 'invalid');
  });

  it('filled required field with unmatching value rejects', () => {
    mount(<Scenario required />);

    cy.get(fieldSelector)
      .type('foo').should('have.value', 'foo')
      .blur()
      .should('have.class', 'invalid')
      .should('not.have.class', 'valid');
  });
});
