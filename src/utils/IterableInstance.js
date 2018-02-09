/**
 * Custom iterable instance prop type validator.
 * This is needed since "PropTypes.instanceOf(Immutable.Map)" doesn't resolve to "true".
 * Multiple bugs are issued relatively to that, hence there is a custom validation.
 */
import invariant from 'invariant';
import { Iterable } from 'immutable';
import { isset } from '../utils';

export default function IterableInstance(props, propName, componentName) {
  const propValue = props[propName];
  if (!isset(propValue)) return null;

  invariant(Iterable.isIterable(propValue), 'Invalid prop `%s` of type `%s` supplied to `%s`, ' +
  'expected an instance of Iterable.', propName, typeof propValue, componentName);
}
