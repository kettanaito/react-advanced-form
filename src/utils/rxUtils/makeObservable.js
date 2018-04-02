import { Map } from 'immutable';
import { Observable } from 'rxjs/Observable';
import addPropsObserver from './addPropsObserver';
import flushFieldRefs from '../flushFieldRefs';
import camelize from '../camelize';

/**
 * Returns the formatted references in a { [fieldPath]: props } format.
 * @param {string[]} refs
 * @returns {Map<string, string[]>}
 */
function formatRefs(refs) {
  return refs.reduce((formatted, ref) => {
    if (ref.length < 2) return formatted;

    /* Assume the last referenced key is always a prop name */
    const fieldPath = ref.slice(0, ref.length - 1);
    const propName = ref.slice(ref.length - 1);

    if (formatted.hasIn(ref)) {
      return formatted.update(fieldPath.join('.'), propsList => propsList.concat(propName));
    }

    return formatted.set(fieldPath.join('.'), propName);
  }, Map());
}

/**
 * Shorthand: Creates a props change observer with the provided arguments.
 * @param {string} targetPath
 * @param {Array<string>} targetProps
 * @param {string} rxPropName
 * @param {Map} fieldProps
 * @param {ReactElement} form
 * @param {Object} observerOptions
 * @returns {Subscription}
 */
function createObserver({ fieldPath, props, form, subscribe, observerOptions }) {
  return addPropsObserver({
    fieldPath,
    props,
    predicate({ propName, prevContextProps, nextContextProps }) {
      return (prevContextProps.get(propName) !== nextContextProps.get(propName));
    },
    getNextValue({ propName, nextContextProps }) {
      return nextContextProps.get(propName);
    },
    eventEmitter: form.eventEmitter,
    ...observerOptions
  }).subscribe(subscribe);
}

/**
 * Makes the provided method observable, subscribing to props changes of the referenced fields in the method.
 * @param {Function} method
 * @param {Object<argName: argValue>} methodArgs
 * @param {Options} options
 */
export default function makeObservable(method, methodArgs, { observerOptions, subscribe, initialCall = false }) {
  const { fieldProps, fields, form } = methodArgs;
  const { refs, initialValue } = flushFieldRefs(method, methodArgs);

  const formattedRefs = formatRefs(refs);
  formattedRefs.forEach((props, gluedFieldPath) => {
    const refFieldPath = gluedFieldPath.split('.');

    /**
     * When the delegated reactive prop resolver executes, we need to determine whether the subscriber field
     * validation is needed. Validate the subscriber when it has any value, otherwise do not validate to
     * prevent invalid fields at initial form render.
     */
    const shouldValidate = !!fieldProps.get(fieldProps.get('valuePropName'));

    if (fields.hasIn(refFieldPath)) {
      const subscription = createObserver({
        fieldPath: refFieldPath,
        props,
        form,
        subscribe,
        observerOptions
      });

      if (initialCall) {
        subscription.next({
          nextContextProps: fieldProps,
          shouldValidate
        });
      }

      return { refs, initialValue };
    }

    /**
     * Create a delegated target field subscription.
     * When the target field is not yet registred, create an observable to listen for its registration event.
     * Since the flushed refs already contain the referenced props, there is no need to analyze the resolver
     * function again, just create a subscription.
     */
    const fieldRegisteredEvent = camelize(...refFieldPath, 'registered');
    const delegatedSubscription = Observable.fromEvent(form.eventEmitter, fieldRegisteredEvent)
      .subscribe((delegatedFieldProps) => {
        /* Get rid of delegated subscription since it's no longer relevant */
        delegatedSubscription.unsubscribe();

        const subscription = createObserver({
          fieldPath: refFieldPath,
          props,
          form,
          subscribe,
          observerOptions
        });

        return subscription.next({
          nextContextProps: delegatedFieldProps,
          shouldValidate
        });
      });
  });

  return { refs, initialValue };
}
