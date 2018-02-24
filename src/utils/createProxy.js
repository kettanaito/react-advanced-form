import { Iterable } from 'immutable';

/**
 * Creates a Proxy over the provided Object and allows to listen to certain manipulations
 * with the proxied origin.
 * @param {Object} origin
 * @returns {Proxy}
 */
export default function createProxy(origin, { getValue, onGetProp }) {
  const isIterable = Iterable.isIterable(origin);

  return new Proxy(origin, {
    get(target, propName) {
      let propValue = isIterable ? target.get(propName) : target[propName];

      /* Ignore ImmutableJS private properties */
      const isReservedProp = /^@@__/.test(propName);

      if (propValue && getValue) {
        propValue = getValue({ target, propName, propValue, isIterable });
      }

      if (!isReservedProp && onGetProp) {
        onGetProp({ target, propName, propValue });
      }

      return propValue;
    }
  });
}
