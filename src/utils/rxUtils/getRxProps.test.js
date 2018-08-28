import { expect } from 'chai'
import { Map } from 'immutable'
import getRxProps from './getRxProps'

test('Returns the map of reactive props', () => {
  const props = {
    name: 'fieldOne',
    type: 'number',
    required: () => true,
  }

  const rxProps = getRxProps(props)

  expect(rxProps)
    .to.be.an.instanceOf(Object)
    .which.has.all.keys(['reactiveProps', 'prunedProps'])
  expect(rxProps.reactiveProps)
    .to.be.an.instanceOf(Object)
    .which.has.all.keys(['required'])
  expect(rxProps.prunedProps)
    .to.be.an.instanceOf(Object)
    .which.has.all.keys(['name', 'type'])
  expect(rxProps.prunedProps).to.deep.equal({
    name: props.name,
    type: props.type,
  })
})
