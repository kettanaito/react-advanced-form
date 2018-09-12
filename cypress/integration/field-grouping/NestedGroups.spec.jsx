import * as R from 'ramda'
import React from 'react'
import Scenario from '@examples/field-grouping/NestedGroups'

describe('Nested groups', function() {
  before(() => {
    cy.loadStory(<Scenario getRef={(form) => (this.form = form)} />)
  })

  it('Registers nested field groups properly', async () => {
    await cy.wait(100)
    const { fields } = this.form.state

    expect(R.has('fieldOne', fields))
    expect(R.path(['groupName', 'fieldOne'], fields)).not.to.be.undefined
    expect(R.path(['groupName', 'fieldTwo'], fields)).not.to.be.undefined
    expect(R.path(['groupName', 'nestedGroup', 'fieldOne'])).not.to.be.undefined
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
