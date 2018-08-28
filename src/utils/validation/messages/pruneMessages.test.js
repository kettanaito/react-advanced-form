import { expect } from 'chai'
import pruneMessages from './pruneMessages'

const a = 'a'
const b = 'b'
const c = 'c'
const z = 'z'
const _ = null

test('should return [a, b]', () => {
  const res = pruneMessages([[a, _, c, z], [b, c, _, z]])
  expect(res).to.deep.equal([a, b])
})

test('should return [a]', () => {
  const res = pruneMessages([[a, _, c, z], [_, _, _, _]])
  const res2 = pruneMessages([[_, b, c, z], [a, _, c, z]])
  expect(res).to.deep.equal([a])
  expect(res2).to.deep.equal([a])
})

test('should return [b]', () => {
  const res = pruneMessages([[_, b, c, z], [_, _, c, z]])
  expect(res).to.deep.equal([b])
})

test('should return [c]', () => {
  const res = pruneMessages([[_, _, c, z], [_, _, _, _]])
  expect(res).to.deep.equal([c])
})

test('should return [z]', () => {
  const res = pruneMessages([[_, _, _, z], [_, _, _, z]])
  expect(res).to.deep.equal([z])
})

test('should return empty array', () => {
  const res = pruneMessages([[_], [_]])
  expect(res).to.be.undefined
})
