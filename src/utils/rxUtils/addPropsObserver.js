import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import camelize from '../camelize';

const defaultPredicate = ({ propName, prevProps, nextProps }) => {
  return (prevProps[propName] !== nextProps[propName]);
};

/**
 * Creates an observer listening to the changes of the provided props of the specified field.
 * Only the changes which satisfy the predicate function will be emitted.
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
      const { prevProps, nextProps, prevContextProps, nextContextProps } = args;

      const changedProps = props ? propsList.reduce((acc, propName) => {
        const hasPropsChanged = appropriatePredicate({ ...args, propName });

        if (hasPropsChanged) {
          acc[propName] = getNextValue ? getNextValue({ ...args, propName }) : nextProps[propName];
        }

        return acc;
      }, {}) : nextProps;

      return {
        ...args,
        changedProps
      };
    })
    /* Emit the caught events with changed props only */
    .filter(({ changedProps }) => Object.keys(changedProps).length > 0);
}
