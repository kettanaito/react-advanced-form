import * as R from 'ramda'
import React from 'react'
import Scenario from '@examples/field-grouping/NestedGroups'

describe('Nested groups', function() {
  before(() => {
    cy.loadStory(<Scenario getRef={(form) => (this.form = form)} />)
  })

  it('Serializes nested field groups properly', () => {
    cy.get('form').should(() => {
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
})
