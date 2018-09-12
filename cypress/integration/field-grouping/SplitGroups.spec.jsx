import * as R from 'ramda'
import React from 'react'
import { expect } from 'chai'
import Scenario from '@examples/field-grouping/SplitGroups'

describe('Split groups', function() {
  before(() => {
    cy.loadStory(<Scenario getRef={(form) => (this.form = form)} />)
  })

  it('Registers split field groups properly', async () => {
    await cy.wait(100)
    const { fields } = this.form.state

    expect(R.has('email', fields)).to.be.true
    expect(R.has('password', fields)).to.be.true
    expect(R.path(['primaryInfo', 'firstName'], fields)).to.not.be.undefined
    expect(R.path(['primaryInfo', 'lastName'], fields)).to.not.be.undefined
    expect(R.path(['primaryInfo', 'newsletter'], fields)).to.not.be.undefined
    expect(R.path(['primaryInfo', 'billingAddress', 'street'], fields)).to.not.be.undefined
    expect(R.path(['primaryInfo', 'billingAddress', 'houseNumber'], fields)).to.not.be.undefined
    expect(R.path(['billingAddress', 'noCollision'], fields)).to.not.be.undefined
  })

  it('Serializes split field groups properly', () => {
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
