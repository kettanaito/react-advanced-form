import { messages } from '@examples/custom-fields/BirthDate'

describe('BirthDate', function() {
  before(() => {
    cy.loadStory(['Advanced', 'Custom fields', 'BirthDate'])
  })

  it('Applies validation messages properly', () => {
    const assertError = (errorText) => {
      return cy
        .getField('birthDate')
        .parent()
        .hasError(errorText)
    }

    /* Invaid day */
    cy.getField('birthDate')
      .eq(0)
      .typeIn('90')
    assertError(
      messages.name.birthDate.rule.year +
        messages.name.birthDate.rule.month +
        messages.name.birthDate.rule.day,
    )

    /* Valid day */
    cy.getField('birthDate')
      .eq(0)
      .clear()
      .typeIn('24')
    assertError(
      messages.name.birthDate.rule.year + messages.name.birthDate.rule.month,
    )

    /* Invalid month */
    cy.getField('birthDate')
      .eq(1)
      .typeIn('13')
    assertError(
      messages.name.birthDate.rule.year + messages.name.birthDate.rule.month,
    )

    /* Valid month */
    cy.getField('birthDate')
      .eq(1)
      .clear()
      .typeIn('12')
    assertError(messages.name.birthDate.rule.year)

    /* Invalid year */
    cy.getField('birthDate')
      .eq(2)
      .typeIn('900')
    assertError(messages.name.birthDate.rule.year)

    /* Valid year */
    cy.getField('birthDate')
      .eq(2)
      .clear()
      .typeIn('2018')
    assertError(false)
  })
})
