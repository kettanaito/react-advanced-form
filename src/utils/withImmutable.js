// utils/withImmutable.js
import { Iterable } from 'immutable';

export default function withImmutable(func, params, context) {
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
