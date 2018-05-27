import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/filter'
import camelize from '../camelize'
import enforceArray from '../enforceArray'

/**
 * @param {string} propName
 * @param {Object} prevTargetProps
 * @param {Object} nextTargetProps
 * @param {Map} prevTargetRecord
 * @param {Map} nextTargetRecord
 * @returns {boolean}
 */
const defaultPredicate = ({ propName, prevTargetProps, nextTargetProps }) => {
  return prevTargetProps[propName] !== nextTargetProps[propName]
}

/**
 * Creates an observer listening to the props change of the provided field.
 * Then emits on each prop change which satisfies the given predicate function.
 * @param {string} targetFieldPath Field path of the subscribed target field.
 * @param {string[]|string} props
 * @param {(eventData: EventData) => boolean} predicate
 * @param {(eventData: EventData) => any} getNextValue
 * @param {EventEmitter} eventEmitter
 * @return {Observable}
 */
export default function createPropsObserver({
  targetFieldPath,
  props,
  predicate,
  getNextValue,
  eventEmitter,
}) {
  const propsChangeEvent = camelize(...targetFieldPath, 'props', 'change')
  const appropriatePredicate = predicate || defaultPredicate
  const propsList = enforceArray(props)

  return (
    Observable.fromEvent(eventEmitter, propsChangeEvent)
      .map((eventData) => {
        const changedProps = propsList.reduce((acc, propName) => {
          const hasPropsChanged = appropriatePredicate({
            ...eventData,
            propName,
          })

          if (hasPropsChanged) {
            return Object.assign({}, acc, {
              [propName]: getNextValue
                ? getNextValue({ ...eventData, propName })
                : eventData.nextTargetProps[propName],
            })
          }

          return acc
        }, {})

        return {
          ...eventData,
          changedProps,
        }
      })
      /* Emit the caught events with changed props only */
      .filter(({ changedProps }) => {
        return Object.keys(changedProps).length > 0
      })
  )
}
