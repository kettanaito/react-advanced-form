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
    (res, propName) => {
      const propValue = props[propName]
      const isReactiveProp =
        supportedRxProps.includes(propName) && typeof propValue === 'function'
      const propDest = isReactiveProp ? 'reactiveProps' : 'prunedProps'

      return Object.assign({}, res, {
        [propDest]: Object.assign({}, res[propDest], {
          [propName]: propValue,
        }),
      })
    },
    {
      reactiveProps: {},
      prunedProps: {},
    },
  )
}
