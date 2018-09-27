import * as R from 'ramda'

//
// TODO It would be great to allow any prop to be a function with the unified
// resolver interface.
//
/* The list of supported dynamic props */
export const supportedRxProps = ['required']

/**
 * Returns the collection of the reactive props present on the provided field.
 */
export default function getRxProps(props) {
  return Object.keys(props).reduce(
    (reactiveProps, propName) => {
      const propValue = props[propName]
      const isReactiveProp =
        supportedRxProps.includes(propName) && typeof propValue === 'function'
      const propGroup = isReactiveProp ? 'reactiveProps' : 'prunedProps'

      return R.assocPath([propGroup, propName], propValue, reactiveProps)
    },
    {
      reactiveProps: {},
      prunedProps: {},
    },
  )
}
