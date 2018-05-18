// @flow
import type { Component } from 'react'

/**
 * Returns the verbose name of the provided React component.
 */
export default function getComponentName(
  component: Component<any, any, any>,
): string {
  return component.displayName || component.name || 'Component'
}
