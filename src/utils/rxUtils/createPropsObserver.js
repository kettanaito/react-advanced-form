import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/filter'
import camelize from '../camelize'
import enforceArray from '../enforceArray'

/**
 * Default predicate function that determines whether there has been
 * a value change between the previous and the next field prop.
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
 * Filters prop changes only.
 * @param {Object} changedProps
 * @returns {boolean}
 */
const filterPropChanges = ({ changedProps }) => {
  return Object.keys(changedProps).length > 0
}

/**
 * Creates an observerable for the props change of the provided field.
 * Emits on each prop change which satisfies the given predicate function.
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
  predicate = defaultPredicate,
  getNextValue,
  eventEmitter,
}) {
  const propsChangeEventName = camelize(...targetFieldPath, 'props', 'change')
  const propsList = enforceArray(props)

  return (
    Observable.fromEvent(eventEmitter, propsChangeEventName)
      .map((eventPayload) => {
        const changedProps = propsList.reduce((acc, propName) => {
          const hasPropsChanged = predicate({
            ...eventPayload,
            propName,
          })

          if (hasPropsChanged) {
            const nextPropValue = getNextValue
              ? getNextValue({ ...eventPayload, propName })
              : eventPayload.nextTargetProps[propName]

            return {
              ...acc,
              [propName]: nextPropValue,
            }
          }

          return acc
        }, {})

        return {
          ...eventPayload,
          changedProps,
        }
      })
      /* Emit the events with changed props only */
      .filter(filterPropChanges)
  )
}
