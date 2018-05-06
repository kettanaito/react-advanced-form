import { expect } from 'chai'
import camelize from './camelize'

describe('camelize', () => {
  it('Turns passed strings into camelCase', () => {
    const res = camelize('camel', 'case', 'string')
    expect(res).to.equal('camelCaseString')
  })

  it('Returns intact single string passed', () => {
    const res = camelize('single')
    expect(res).to.equal('single')
  })
})
