import { expect } from 'chai'

it('Serializes nested field groups properly', () => {
  cy.loadStory(['Advanced', 'Field grouping', 'Nested groups'])

  cy.window().should(($window) => {
    const serialized = $window.form.serialize()

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
