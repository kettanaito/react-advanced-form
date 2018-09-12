import pruneMessages from './pruneMessages'

const a = 'a'
const b = 'b'
const c = 'c'
const z = 'z'
const _ = null

test('should return [a, b]', () => {
  const res = pruneMessages([[a, _, c, z], [b, c, _, z]])
  expect(res).toEqual([a, b])
})

test('should return [a]', () => {
  const res = pruneMessages([[a, _, c, z], [_, _, _, _]])
  const res2 = pruneMessages([[_, b, c, z], [a, _, c, z]])
  expect(res).toEqual([a])
  expect(res2).toEqual([a])
})

test('should return [b]', () => {
  const res = pruneMessages([[_, b, c, z], [_, _, c, z]])
  expect(res).toEqual([b])
})

test('should return [c]', () => {
  const res = pruneMessages([[_, _, c, z], [_, _, _, _]])
  expect(res).toEqual([c])
})

test('should return [z]', () => {
  const res = pruneMessages([[_, _, _, z], [_, _, _, z]])
  expect(res).toEqual([z])
})

test('should return empty array', () => {
  const res = pruneMessages([[_], [_]])
  expect(res).toBeUndefined()
})
