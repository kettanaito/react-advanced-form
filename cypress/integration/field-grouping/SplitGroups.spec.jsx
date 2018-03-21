import React from 'react';
import { expect } from 'chai';
import { mount } from 'cypress-react-unit-test';
import Scenario from '@examples/field-grouping/SplitGroups';

describe('Split groups', function () {
  before(() => mount(<Scenario getRef={ form => this.form = form } />));

  it('Fields in split groups register properly', async() => {
    await cy.wait(100);
    const { fields } = this.form.state;

    expect(fields.has('email')).to.be.true;
    expect(fields.has('password')).to.be.true;
    expect(fields.hasIn(['primaryInfo', 'firstName'])).to.be.true;
    expect(fields.hasIn(['primaryInfo', 'lastName'])).to.be.true;
    expect(fields.hasIn(['primaryInfo', 'newsletter'])).to.be.true;
    expect(fields.hasIn(['primaryInfo', 'billingAddress', 'street'])).to.be.true;
    expect(fields.hasIn(['primaryInfo', 'billingAddress', 'houseNumber'])).to.be.true;
    expect(fields.hasIn(['billingAddress', 'noCollision'])).to.be.true;
  });

  it('Form with split groups serializes properly', () => {
    const serialized = this.form.serialize();

    console.log(JSON.stringify(serialized))

    expect(serialized).to.deep.equal({
      email: 'john@maverick.com',
      password: 'super-secret',
      primaryInfo: {
        firstName: 'John',
        lastName: 'Maverick',
        newsletter: true,
        billingAddress: {
          street: 'Sunwell ave.',
          houseNumber: '3'
        }
      },
      billingAddress: {
        noCollision: true
      }
    });
  });
});
