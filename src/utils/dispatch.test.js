import dispatch from './dispatch'

const args = {
  a: {
    nestedProp: 'foo',
  },
  b: 'value',
}

test('Dispatches the given function when it exists', () => {
  dispatch(({ a, b }) => {
    expect(a).toBeInstanceOf(Object)
    expect(a.nestedProp).toEqual(args.a.nestedProp)
    expect(b).toEqual(args.b)
  }, args)
})

test('Silences function call when the function does not exist', () => {
  const call = () => dispatch(null, args)
  expect(call).not.toThrow()
})
