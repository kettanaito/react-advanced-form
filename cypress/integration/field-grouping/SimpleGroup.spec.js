import { expect } from 'chai'

it('Serializes grouped fields properly', () => {
  cy._loadStory(['Advanced', 'Field grouping', 'Simple group'])

  cy.window().should(($window) => {
    const serialized = $window.form.serialize()

    expect(serialized).to.deep.equal({
      fieldOne: 'foo',
      groupName: {
        fieldOne: 'bar',
      },
    })
  })
})
