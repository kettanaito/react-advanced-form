import * as R from 'ramda'
import React from 'react'
import { expect } from 'chai'
import Scenario from '@examples/field-grouping/SplitGroups'

describe('Split groups', function() {
  before(() => {
    cy.loadStory(<Scenario getRef={(form) => (this.form = form)} />)
  })

  it('Serializes split field groups properly', () => {
    cy.get('form').should(() => {
      const serialized = this.form.serialize()

      expect(serialized).to.deep.equal({
        email: 'john@maverick.com',
        password: 'super-secret',
        primaryInfo: {
          firstName: 'John',
          lastName: 'Maverick',
          newsletter: true,
          billingAddress: {
            street: 'Sunwell ave.',
            houseNumber: '3',
          },
        },
        billingAddress: {
          noCollision: true,
        },
      })
    })
  })
})
