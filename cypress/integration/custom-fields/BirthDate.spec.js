import { messages } from '@examples/custom-fields/BirthDate'

const assertError = (fieldName, errorText) => {
  return cy
    .getField(fieldName)
    .parent()
    .hasError(errorText)
}

describe('BirthDate', function() {
  before(() => {
    cy.loadStory(['Advanced', 'Custom fields', 'BirthDate'])
  })

  it('Inherits "assertValue" for mount validation', () => {
    cy.getField('birthDateTwo')
      .eq(0)
      .valid()

    cy.getField('birthDateTwo')
      .eq(1)
      .valid()

    cy.getField('birthDateTwo')
      .eq(2)
      .valid()

    assertError('birthDateTwo', false)
  })

  it('Applies validation messages properly', () => {
    /* Invaid day */
    cy.getField('birthDate')
      .eq(0)
      .typeIn('90')
    assertError(
      'birthDate',
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
      'birthDate',
      messages.name.birthDate.rule.year + messages.name.birthDate.rule.month,
    )

    /* Invalid month */
    cy.getField('birthDate')
      .eq(1)
      .typeIn('13')
    assertError(
      'birthDate',
      messages.name.birthDate.rule.year + messages.name.birthDate.rule.month,
    )

    /* Valid month */
    cy.getField('birthDate')
      .eq(1)
      .clear()
      .typeIn('12')
    assertError('birthDate', messages.name.birthDate.rule.year)

    /* Invalid year */
    cy.getField('birthDate')
      .eq(2)
      .typeIn('900')
    assertError('birthDate', messages.name.birthDate.rule.year)

    /* Valid year */
    cy.getField('birthDate')
      .eq(2)
      .clear()
      .typeIn('2018')
    assertError('birthDate', false)
  })
})
