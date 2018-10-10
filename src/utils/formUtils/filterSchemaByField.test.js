import * as recordUtils from '../recordUtils'
import filterSchemaByField from './filterSchemaByField'

const fieldOne = recordUtils.createField({
  name: 'fieldOne',
})

test('Returns empty list when no applicable rules are found', () => {
  const res = filterSchemaByField(
    {
      type: {
        email: ({ value }) => value,
      },
      name: {
        fieldTwo: ({ value }) => value,
      },
    },
    fieldOne,
  )

  expect(res).toEqual([])
})

test('Returns relative type-specific rules', () => {
  const textRule = () => true

  const res = filterSchemaByField(
    {
      type: {
        text: textRule,
      },
      name: {
        fieldTwo: () => true,
      },
    },
    fieldOne,
  )

  expect(res).toEqual([
    {
      keyPath: ['type', 'text'],
      selector: 'type',
      resolver: textRule,
    },
  ])
})

test('Returns relative name-specific rules', () => {
  const namedRule = () => true

  const res = filterSchemaByField(
    {
      name: {
        fieldOne: namedRule,
      },
    },
    fieldOne,
  )

  expect(res).toEqual([
    {
      keyPath: ['name', 'fieldOne'],
      selector: 'name',
      resolver: namedRule,
    },
  ])
})

test('Returns relative type and name specific rules', () => {
  const textRule = () => true
  const namedRule = () => true

  const res = filterSchemaByField(
    {
      type: {
        text: textRule,
      },
      name: {
        fieldOne: namedRule,
      },
    },
    fieldOne,
  )

  expect(res).toEqual([
    {
      keyPath: ['name', 'fieldOne'],
      selector: 'name',
      resolver: namedRule,
    },
    {
      keyPath: ['type', 'text'],
      selector: 'type',
      resolver: textRule,
    },
  ])
})

test('Handles multiple resolvers on a single relevant selector', () => {
  const textRule = () => true
  const ruleOne = () => true
  const ruleTwo = () => true

  const res = filterSchemaByField(
    {
      type: {
        text: textRule,
      },
      name: {
        fieldOne: {
          ruleOne,
          ruleTwo,
        },
      },
    },
    fieldOne,
  )

  expect(res).toEqual([
    {
      selector: 'name',
      keyPath: ['name', 'fieldOne'],
      resolver: ruleOne,
    },
    {
      selector: 'name',
      keyPath: ['name', 'fieldOne'],
      resolver: ruleTwo,
    },
    {
      selector: 'type',
      keyPath: ['type', 'text'],
      resolver: textRule,
    },
  ])
})
