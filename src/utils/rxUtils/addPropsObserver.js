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
 */
const defaultPredicate = ({ propName, prevProps, nextProps }) => {
  return (prevProps[propName] !== nextProps[propName]);
};

/**
 * Creates an observer listening to the props changes of the provided field.
 * Then emits on each prop change which satisfies the given predicate function.
 * @param {string} fieldPath Field path of the subscribed target field.
 * @param {Array<string>|string} props
 * @param {Function: boolean} predicate
 * @param {EventEmitter} eventEmitter
 * @return {Observable}
 */
export default function addPropsObserver({ fieldPath, props, predicate, getNextValue, eventEmitter }) {
  const propsChangeEvent = camelize(fieldPath, 'props', 'change');
  const appropriatePredicate = predicate || defaultPredicate;
  const propsList = Array.isArray(props) ? props : [props];

  return Observable.fromEvent(eventEmitter, propsChangeEvent)
    .map((args) => {
      const changedProps = propsList.reduce((acc, propName) => {
        const hasPropsChanged = appropriatePredicate({ ...args, propName });

        if (hasPropsChanged) {
          acc[propName] = getNextValue ? getNextValue({ ...args, propName }) : args.nextProps[propName];
        }

        return acc;
      }, {});

      return {
        ...args,
        changedProps
      };
    })
    /* Emit the caught events with changed props only */
    .filter(({ changedProps }) => (Object.keys(changedProps).length > 0));
}
