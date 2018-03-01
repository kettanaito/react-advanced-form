import React from 'react';
import { Map } from 'immutable';
import { expect } from 'chai';
import { mount } from 'cypress-react-unit-test';
import Scenario from '@scenarios/Components/createField';

describe('createField', function () {
  before(() => mount(<Scenario getRef={ form => this.form = form } />));

  it('Enhanced field registers properly', () => {
    cy.get('[name="fieldOne"]').then(() => {
      setTimeout(() => {
        const { fields } = this.form.state;
        const fieldProps = fields.get('fieldOne');

        expect(fieldProps).to.be.an.instanceOf(Map);
        expect(fieldProps.get('name')).to.equal('fieldOne');
        expect(fieldProps.get('fieldPath')).to.deep.equal(['fieldOne']);
      }, 100);
    });
  });

  it('Supports custom event handlers', () => {
    const testWord = 'Text';

    cy.get('[name="fieldOne"]').type(testWord).should('have.value', testWord);
    cy.get('#count').should('have.text', String(testWord.length));
  });
});
