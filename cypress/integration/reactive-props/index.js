import React from 'react'
import DynamicRequired from '@examples/reactive-props/DynamicRequired'
import DelegatedScenario from '@examples/reactive-props/DelegatedSubscription'
import InterdependentScenario from '@examples/reactive-props/Interdependent'
import SingleTargetScenario from '@examples/reactive-props/SingleTarget'
import FieldReactiveField from '@examples/reactive-props/FieldReactiveRule'

describe('Reactive props', function() {
  it('Supports direct field subscription', () => {
    cy.loadStory(<DynamicRequired />)

    cy.getField('lastName').should('have.attr', 'required')
    cy
      .getField('lastName')
      .focus()
      .blur()
      .should('have.class', 'is-invalid')

    cy.getField('firstName').clear()
    cy
      .getField('lastName')
      .should('not.have.attr', 'required')
      .should('not.have.class', 'is-invalid')
  })

  it('Supports delegated field subscription', () => {
    cy.loadStory(<DelegatedScenario />)

    cy.getField('firstName').should('have.attr', 'required')
    cy
      .getField('firstName')
      .focus()
      .blur()
      .valid(false)

    cy.getField('lastName').clear()
    cy.getField('firstName').should('not.have.attr', 'required')
  })

  it('Supports inter-dependent fields', () => {
    cy.loadStory(<InterdependentScenario />)

    cy.getField('firstName').should('not.have.attr', 'required')
    cy.getField('lastName').should('not.have.attr', 'required')

    cy.getField('firstName').typeIn('foo')
    cy.getField('lastName').should('have.attr', 'required')
    cy.getField('firstName').clear()
    cy.getField('lastName').should('not.have.attr', 'required')

    cy.getField('lastName').typeIn('doe')
    cy.getField('firstName').should('have.attr', 'required')
    cy.getField('lastName').clear()
    cy.getField('firstName').should('not.have.attr', 'required')

    cy.getField('firstName').typeIn('foo')
    cy.getField('lastName').typeIn('doe')
    cy.getField('firstName').should('have.attr', 'required')
    cy.getField('lastName').should('have.attr', 'required')

    cy.getField('firstName').clear()
    cy.getField('lastName').clear()
    cy.getField('firstName').should('not.have.attr', 'required')
    cy.getField('lastName').should('not.have.attr', 'required')
  })

  it('Supports multiple fields depending on one target', () => {
    cy.loadStory(<SingleTargetScenario />)

    cy.getField('firstName').should('not.have.attr', 'required')
    cy.getField('fieldThree').should('not.have.attr', 'required')

    cy.getField('lastName').typeIn('foo')
    cy
      .getField('firstName')
      .valid(false)
      .should('have.attr', 'required')
    cy
      .getField('fieldThree')
      .valid(false)
      .should('have.attr', 'required')

    cy
      .getField('firstName')
      .typeIn('foo')
      .valid()

    cy
      .getField('fieldThree')
      .typeIn('doe')
      .valid()

    cy
      .getField('lastName')
      .clear()
      .should('not.have.value')
    cy
      .getField('firstName')
      .should('not.have.class', 'is-invalid')
      .should('not.have.class', 'is-valid')
      .should('not.have.attr', 'required')
    cy
      .getField('fieldThree')
      .should('not.have.class', 'is-invalid')
      .should('not.have.class', 'is-valid')
      .should('not.have.attr', 'required')
  })

  it('Supports field "rule" as a reactive prop', () => {
    cy.loadStory(<FieldReactiveField />)

    /**
     * Properly validates the reactive field when its value changes.
     */
    cy.getField('fieldOne').typeIn('bar')
    cy
      .getField('fieldTwo')
      .should('not.have.class', 'is-valid')
      .should('not.have.class', 'is-invalid')
      .typeIn('foo')
      .should('have.class', 'is-invalid')
      .clear()
      .should('not.have.class', 'is-valid')
      .should('not.have.class', 'is-invalid')
      .typeIn('bar')
      .should('have.class', 'is-valid')
      .should('not.have.class', 'is-invalid')

    /**
     * Properly vaidated the reactive field when the value of the
     * referenced field changes.
     */
    cy
      .getField('fieldTwo')
      .clear()
      .typeIn('bars')
      .should('have.class', 'is-invalid')
      .should('not.have.class', 'is-valid')
    cy
      .getField('fieldOne')
      .clear()
      .typeIn('bars')
    cy
      .getField('fieldTwo')
      .should('have.class', 'is-valid')
      .should('not.have.class', 'is-invalid')
  })
})
