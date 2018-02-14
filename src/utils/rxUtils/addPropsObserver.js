import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import createEvent from './createEvent';

const defaultPredicate = ({ propName, prevProps, nextProps }) => {
  return (prevProps[propName] !== nextProps[propName]);
};

/**
 * Creates an observer listening to the changes of the provided props of the specified field.
 * Only the changes which satisfy the predicate function will be emitted.
 * @param {string} fieldPath
 * @param {string[]} props
 * @param {Function: boolean} predicate
 * @param {EventEmitter} eventEmitter
 * @return {Observable}
 */
export default function addPropsListener({ fieldPath, props, predicate, eventEmitter }) {
  const fieldPropsChange = createEvent(fieldPath, 'props', 'change');
  const resolvedPredicated = predicate || defaultPredicate;

  return Observable.fromEvent(eventEmitter, fieldPropsChange)
    .map((args) => {
      const { prevProps, nextProps } = args;

      /* Compose the changed props Object */
      const changedProps = props.reduce((acc, propName) => {
        const hasChanged = resolvedPredicated({ ...args, propName });

        if (hasChanged) {
          acc[propName] = nextProps[propName];
        }

        return acc;
      }, {});

      return (Object.keys(changedProps).length > 0) ? changedProps : null;
    })
    /* Emit the caught events with changed props only */
    .filter(changedProps => changedProps);
}
