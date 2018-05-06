import { expect } from 'chai'
import { fromJS, Map } from 'immutable'
import flattenDeep from './flattenDeep'

const initialState = {
  a: {
    one: 'foo',
    two: 5,
    three: {
      uno: true,
      dos: false
    }
  },
  b: 'bar'
}

const iter = fromJS(initialState)

const stringsOnly = (value, deepKeyPath) => {
  expect(deepKeyPath).to.be.a.instanceOf(Array).with.length.gt(0)
  return typeof value === 'string'
}

describe('flattenDeep', () => {
  it('Returns intact iterable when no predicate is provided', () => {
    const res = flattenDeep(iter)
    expect(Map.isMap(res))
    expect(res.toJS()).to.deep.equal(initialState)
  })

  it('Returns values which satisfy the given predicate', () => {
    const res = flattenDeep(iter, stringsOnly)

    expect(Map.isMap(res))
    expect(res.equals(
      iter
        .deleteIn(['a', 'two'])
        .deleteIn(['a', 'three'])
    ))
  })

  it('Allows to flatten keys', () => {
    // TODO "flattenKeys" doesn't work without custom "predicate"
    const res = flattenDeep(iter, stringsOnly, true)

    expect(Map.isMap(res))
    expect(res.toJS()).to.deep.equal({
      'a.one': 'foo',
      b: 'bar'
    })
  })

  it('Allows transforming values', () => {
    const transformValues = (value, deepKeyPath) => {
      expect(deepKeyPath).to.be.an.instanceOf(Array).with.length.gt(0)
      return `_${value}`
    }
    const res = flattenDeep(iter, stringsOnly, false, transformValues)

    expect(Map.isMap(res))
    expect(res.getIn(['a', 'one'])).to.equal('_foo')
    expect(res.getIn(['b'])).to.equal('_bar')
  })

  it('Allows transforming keys', () => {
    const transformKeys = (deepKeyPath) => {
      expect(deepKeyPath).to.be.an.instanceOf(Array).with.length.gt(0)
      return deepKeyPath.join('_')
    }
    const res = flattenDeep(iter, stringsOnly, true, null, transformKeys)

    expect(Map.isMap(res))
    expect(res.hasIn(['a_one']))
    expect(res.hasIn(['b']))
  })
})
