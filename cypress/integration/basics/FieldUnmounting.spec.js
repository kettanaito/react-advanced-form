import { expect } from 'chai'
import * as R from 'ramda'

describe('Field unmounting', function() {
  const toggleInput = () => cy.get('button').click()

  before(() => {
    cy.loadStory(['Basics', 'Interaction', 'Field unmounting'])
  })

  it('Unregisters fields that have been removed after "componentDidMount"', () => {
    cy.window().should(($window) => {
      const { fields } = $window.form.state

      expect(R.path(['fieldOne'], fields)).to.not.be.undefined
      expect(R.path(['groupName', 'fieldTwo'], fields)).to.be.undefined
      expect(R.path(['groupName', 'fieldThree'], fields)).to.be.undefined
    })
  })

  it('Registers conditionally rendered fields', () => {
    toggleInput()
    cy.window().should(($window) => {
      const { fields } = $window.form.state

      expect(R.path(['fieldOne'], fields)).to.not.be.undefined
      expect(R.path(['groupName', 'fieldTwo'], fields)).to.not.be.undefined
      expect(R.path(['groupName', 'fieldThree'], fields)).to.not.be.undefined
    })
  })

  it('Unregisters fields that have been unmounted upon interaction', () => {
    toggleInput()
    cy.window().should(($window) => {
      const { fields } = $window.form.state

      expect(R.path(['fieldOne'], fields)).to.not.be.undefined
      expect(R.path(['groupName', 'fieldTwo'], fields)).to.be.undefined
      expect(R.path(['groupName', 'fieldThree'], fields)).to.be.undefined
    })
  })
})
