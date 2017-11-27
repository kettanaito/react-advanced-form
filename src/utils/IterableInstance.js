/**
 * Custom iterable prop type validator.
 */
import { Iterable } from 'immutable';

export default function IterableInstance(props, propName, componentName) {
  const isValid = Iterable.isIterable(props[propName]);

  if (!isValid) {
    return new Error(`Invalid prop "${propName}" supplied to "${componentName},
      expected an instance of Iterable (ImmutableJS).`);
  }
}
