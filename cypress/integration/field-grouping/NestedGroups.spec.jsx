import React from 'react';
import { expect } from 'chai';
import { mount } from 'cypress-react-unit-test';
import Scenario from '@examples/field-grouping/NestedGroups';

describe('Nested groups', function () {
  before(() => mount(<Scenario getRef={ form => this.form = form } />));

  it('Fields in nested groups register properly', async () => {
    await cy.wait(100)
    const { fields } = this.form.state;

    expect(fields.has('fieldOne')).to.be.true;
    expect(fields.hasIn(['groupName', 'fieldOne'])).to.be.true;
    expect(fields.hasIn(['groupName', 'fieldTwo'])).to.be.true;
    expect(fields.hasIn(['groupName', 'nestedGroup', 'fieldOne'])).to.be.true;
  });

  it('Form with nested groups serializes properly', () => {
    const serialized = this.form.serialize();

    expect(serialized).to.deep.equal({
      fieldOne: 'foo',
      groupName: {
        fieldOne: 'bar',
        nestedGroup: {
          fieldOne: 'poo'
        }
      }
    });
  });
});
