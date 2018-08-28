import { expect } from 'chai'
import { Map } from 'immutable'
import dispatch from './dispatch'

const args = {
  a: Map({
    nestedProp: 'foo',
  }),
  b: 'value',
}

test('Bypasses Immutable instances when invoked with "withImmutable: true', () => {
  dispatch(
    ({ a, b }) => {
      expect(a).to.be.an.instanceOf(Map)
      expect(a.get('nestedProp')).to.equal('foo')
      expect(b).to.equal('value')
    },
    args,
    {
      withImmutable: true,
    },
  )
})

test('Converts Immutable instances to JS when invoked with "withImmutable: false', () => {
  dispatch(
    ({ a, b }) => {
      expect(a).to.be.an.instanceOf(Object)
      expect(a.nestedProp).to.equal('foo')
      expect(b).to.equal('value')
    },
    args,
    {
      withImmutable: false,
    },
  )
})
