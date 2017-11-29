/**
 * Custom iterable prop type validator.
 * This is needed since "PropTypes.instanceOf(Immutable.Map)" doesn't resolve to "true".
 * Multiple bugs are issued relatively to that, hence there is a custom validation.
 */
import invariant from 'invariant';
import { Iterable } from 'immutable';

export default function IterableInstance(props, propName, componentName) {
  const propValue = props[propName];

  invariant(Iterable.isIterable(propValue), `Invalid prop \`${propName}\` of type \`${typeof propValue}\` supplied to \`${componentName}\`, expected an instance of Iterable.`);
}
