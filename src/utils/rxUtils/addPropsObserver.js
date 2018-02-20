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
 * @param {string} target Field path of the subscribed target field.
 * @param {Array<string>|string} props
 * @param {Function: boolean} predicate
 * @param {EventEmitter} eventEmitter
 * @return {Observable}
 */
export default function addPropsListener({ target, props, predicate, getNextValue, eventEmitter }) {
  const propsChangeEvent = camelize(target, 'props', 'change');
  const resolvedPredicated = predicate || defaultPredicate;
  const iterableProps = Array.isArray(props) ? props : [props];

  return Observable.fromEvent(eventEmitter, propsChangeEvent)
    .map((args) => {
      const { prevProps, nextProps } = args;

      /* Compose the changed props Object */
      const changedProps = iterableProps.reduce((acc, propName) => {
        const hasChanged = resolvedPredicated({ ...args, propName });

        if (hasChanged) {
          acc[propName] = getNextValue ? getNextValue({ ...args, propName }) : nextProps[propName];
        }

        return acc;
      }, {});

      return (Object.keys(changedProps).length > 0) ? changedProps : null;
    })
    /* Emit the caught events with changed props only */
    .filter(changedProps => changedProps);
}
