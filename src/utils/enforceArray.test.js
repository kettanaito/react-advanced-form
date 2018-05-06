import { expect } from 'chai'
import enforceArray from './enforceArray'

describe('enforceArray', () => {
  it('Converts non-array into array', () => {
    const res = enforceArray('value')
    expect(res).to.be.an.instanceOf(Array).that.deep.equals(['value'])
  })

  it('Bypasses array passed as an argument', () => {
    const res = enforceArray(['value'])
    expect(res).to.be.an.instanceOf(Array).that.deep.equals(['value'])
  })
})
