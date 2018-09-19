import * as R from 'ramda'
import { expect } from 'chai'
import React from 'react'
import Scenario from '@examples/field-grouping/SimpleGroup'

describe('Simple group', function() {
  before(() => {
    cy.loadStory(<Scenario getRef={(form) => (this.form = form)} />)
  })

  it('Serializes grouped fields properly', () => {
    cy.get('form').should(() => {
      const serialized = this.form.serialize()

      expect(serialized).to.deep.equal({
        fieldOne: 'foo',
        groupName: {
          fieldOne: 'bar',
        },
      })
    })
  })
})
