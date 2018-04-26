import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import camelize from '../camelize';

/**
 * @param {string} propName
 * @param {Object} prevProps
 * @param {Object} nextProps
 * @param {Map} prevContextProps
 * @param {Map} nextContextProps
 * @returns {boolean}
 */
const defaultPredicate = ({ propName, prevProps, nextProps }) => {
  return (prevProps[propName] !== nextProps[propName]);
};

/**
 * Creates an observer listening to the props changes of the provided field.
 * Then emits on each prop change which satisfies the given predicate function.
 * @param {string} fieldPath Field path of the subscribed target field.
 * @param {string[]|string} props
 * @param {(eventData: EventData) => boolean} predicate
 * @param {(eventData: EventData) => any} getNextValue
 * @param {EventEmitter} eventEmitter
 * @return {Observable}
 */
export default function createPropsObserver({ fieldPath, props, predicate, getNextValue, eventEmitter }) {
  const propsChangeEvent = camelize(...fieldPath, 'props', 'change');
  const appropriatePredicate = predicate || defaultPredicate;
  const propsList = Array.isArray(props) ? props : [props];

  return Observable.fromEvent(eventEmitter, propsChangeEvent)
    .map((eventData) => {
      const changedProps = propsList.reduce((acc, propName) => {
        const hasPropsChanged = appropriatePredicate({ ...eventData, propName });

        if (hasPropsChanged) {
          acc[propName] = getNextValue
            ? getNextValue({ ...eventData, propName })
            : eventData.nextProps[propName];
        }

        return acc;
      }, {});

      return {
        ...eventData,
        changedProps
      };
    })
    /* Emit the caught events with changed props only */
    .filter(({ changedProps }) => {
      return (Object.keys(changedProps).length > 0);
    });
}
