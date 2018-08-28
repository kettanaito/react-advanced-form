import React from 'react'
import { expect } from 'chai'
import Scenario from '@examples/field-grouping/NestedGroups'

describe('Nested groups', function() {
  before(() => {
    cy.loadStory(<Scenario getRef={(form) => (this.form = form)} />)
  })

  it('Registers nested field groups properly', async () => {
    await cy.wait(100)
    const { fields } = this.form.state

    expect(fields.has('fieldOne')).to.be.true
    expect(fields.hasIn(['groupName', 'fieldOne'])).to.be.true
    expect(fields.hasIn(['groupName', 'fieldTwo'])).to.be.true
    expect(fields.hasIn(['groupName', 'nestedGroup', 'fieldOne'])).to.be.true
  })

  it('Serializes nested field groups properly', () => {
    const serialized = this.form.serialize()

    expect(serialized).to.deep.equal({
      fieldOne: 'foo',
      groupName: {
        fieldOne: 'bar',
        nestedGroup: {
          fieldOne: 'poo',
        },
      },
    })
  })
})
