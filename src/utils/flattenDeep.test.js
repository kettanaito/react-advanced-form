import * as R from 'ramda'
import flattenDeep from './flattenDeep'

const initialState = {
  a: {
    one: 'foo',
    two: 5,
    three: {
      uno: true,
      dos: false,
    },
  },
  b: 'bar',
}

const filterString = (value, deepKeyPath) => {
  expect(deepKeyPath).toBeInstanceOf(Array)
  expect(deepKeyPath.length).toBeGreaterThan(0)
  return typeof value === 'string'
}

test('Returns intact iterable when no predicate is provided', () => {
  const res = flattenDeep(initialState)
  expect(res).toEqual(initialState)
})

test('Returns values which satisfy the given predicate', () => {
  const res = flattenDeep(initialState, filterString)

  const prepareInitialState = R.compose(
    R.dissocPath(['a', 'two']),
    R.dissocPath(['a', 'three']),
  )

  expect(res).toEqual(prepareInitialState(initialState))
})

test('Allows to flatten keys', () => {
  const res = flattenDeep(initialState, filterString, true)

  expect(res).toEqual({
    'a.one': 'foo',
    b: 'bar',
  })
})

test('Allows transforming values', () => {
  const transformValues = (value, deepKeyPath) => {
    expect(deepKeyPath).toBeInstanceOf(Array)
    expect(deepKeyPath.length).toBeGreaterThan(0)
    return `_${value}`
  }
  const res = flattenDeep(initialState, filterString, false, transformValues)

  expect(R.path(['a', 'one'], res)).toEqual('_foo')
  expect(R.path(['b'], res)).toEqual('_bar')
})

test('Allows transforming keys', () => {
  const transformKeys = (deepKeyPath) => {
    expect(deepKeyPath).toBeInstanceOf(Array)
    expect(deepKeyPath.length).toBeGreaterThan(0)
    return deepKeyPath.join('_')
  }

  const res = flattenDeep(
    initialState,
    filterString,
    true,
    undefined,
    transformKeys,
  )

  expect(R.has('a_one', res))
  expect(R.has('b', res))
})
