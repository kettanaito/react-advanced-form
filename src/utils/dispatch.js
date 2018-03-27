import { Iterable } from 'immutable';

/**
 * Dispatches the provided function after applying conditional transformations to its params
 * based on the passed context options.
 * @param {Function} func
 * @param {Object} args
 * @param {Object} context
 */
export default function dispatch(func, args, context = {}, overrides = {}) {
  const { withImmutable } = context;

  /* When Immutable args allowed, bypass any transformation */
  const resolvedArgs = withImmutable
    ? args
    : Object.keys(args).reduce((nextArgs, argName) => {
      const argValue = args[argName];
      nextArgs[argName] = Iterable.isIterable(argValue) ? argValue.toJS() : argValue;

      return nextArgs;
    }, {});

  return func({ ...resolvedArgs, ...overrides });
}
