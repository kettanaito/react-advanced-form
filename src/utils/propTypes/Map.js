import { Map } from 'immutable'
import createPropType from 'create-prop-types'

const MapPropType = createPropType({
  predicate: (propValue) => Map.isMap(propValue),
  warnings: {
    invalid: (propName, propValue, componentName) => {
      return `Invalid prop \`${propName}\` of type \`${typeof propValue}\` supplied to \`${componentName}\`, ' +
        'expected an instance of Immutable Map.`
    },
  },
})

export default MapPropType
