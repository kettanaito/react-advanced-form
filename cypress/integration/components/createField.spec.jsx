import React from 'react'
import { Record } from 'immutable'
import { expect } from 'chai'
import Scenario from '@examples/components/createField'

describe('createField', function() {
  before(() => {
    cy.loadStory(<Scenario getRef={(form) => (this.form = form)} />)
  })

  it('Registers enhanced fields properly', () => {
    cy.get('[name="fieldOne"]').then(() => {
      setTimeout(() => {
        const { fields } = this.form.state
        const fieldProps = fields.get('fieldOne')

        expect(Record.isRecord(fieldProps))
        expect(fieldProps.name).to.equal('fieldOne')
        expect(fieldProps.fieldPath).to.deep.equal(['fieldOne'])
      }, 100)
    })
  })

  it('Supports custom field event handlers', () => {
    const testWord = 'Text'

    cy
      .get('[name="fieldOne"]')
      .type(testWord)
      .should('have.value', testWord)
    cy.get('#count').should('have.text', String(testWord.length))
  })
})
