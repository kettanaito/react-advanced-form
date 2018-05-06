import { expect } from 'chai'
import React from 'react'
import getComponentName from './getComponentName'

describe('getComponentName', () => {
  it('Returns proper name for components with explicit "displayName', () => {
    class ComponentA extends React.Component {
      static displayName = 'CustomName'
    }

    const componentName = getComponentName(ComponentA)
    expect(componentName).to.equal('CustomName')
  })

  it('Returns default "Component" name for unnamed components', () => {
    const componentName = getComponentName(<div />)
    expect(componentName).to.equal('Component')
  })
})