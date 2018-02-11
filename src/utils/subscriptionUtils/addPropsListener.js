import { List, Map } from 'immutable';
import { Observable } from 'rxjs/Observable';
import createEvent from './createEvent';

export default function addPropsListener({ fieldPath, subscriber, props, resolver, eventEmitter }) {
  const propsList = Array.isArray(props) ? props : [props];

  return propsList.reduce((result, propName) => {
    const eventName = createEvent(fieldPath, propName, 'change');
    const observer = Observable.fromEvent(eventEmitter, eventName);

    /**
     * Wrap the instance of Observable in a handler function.
     * This way the behavior of observer can be modified per use case. For example, some events must be captured
     * in a debounced mode, some may require accumulation or buffering. Nothing should be enforced.
     */
    resolver(observer);

    const prevSubscriptions = result.getIn([fieldPath]) || Map({
      subscribers: List([subscriber]),
      props: List()
    });

    const nextSubscriptions = prevSubscriptions.update('props', props => props.push(propName));
    return result.setIn([fieldPath], nextSubscriptions);
  }, Map());
}
