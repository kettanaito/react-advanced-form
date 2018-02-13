import { Iterable } from 'immutable';

/**
 * Dispatches the provided function after applying conditional transformations to its params
 * based on the passed context options.
 * @param {Function} func
 * @param {Object} params
 * @param {Object} context
 */
export default function dispatch(func, params, context) {
  const { withImmutable } = context;

  /* When Immutable params allowed, bypass any transformation */
  const resolvedParams = withImmutable
    ? params
    : Object.keys(params).reduce((nextParams, paramName) => {
      const paramValue = params[paramName];
      nextParams[paramName] = Iterable.isIterable(paramValue) ? paramValue.toJS() : paramValue;

      return nextParams;
    }, {});

  return func(resolvedParams);
}
