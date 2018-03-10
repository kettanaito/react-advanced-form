import { Map } from 'immutable';
import { Observable } from 'rxjs/Observable';
import addPropsObserver from './addPropsObserver';
import camelize from '../camelize';
import createProxy from '../createProxy';
import flushFieldRefs from '../flushFieldRefs';
import ensafeMap from '../ensafeMap';
import warning from '../warning';

/**
 * Shorthand: Creates a props change observer with the provided arguments.
 * @param {string} targetPath
 * @param {Array<string>} targetProps
 * @param {string} rxPropName
 * @param {Function} resolver
 * @param {Map} fieldProps
 * @param {ReactElement} form
 * @returns {Subscription}
 */
function createObserver({ fieldPath, props, refs, rxPropName, resolver, fieldProps, form }) {
  const subscriberFieldPath = fieldProps.get('fieldPath');

  return addPropsObserver({
    fieldPath,
    props,
    predicate({ propName, prevContextProps, nextContextProps }) {
      return (prevContextProps.get(propName) !== nextContextProps.get(propName));
    },
    getNextValue({ propName, nextContextProps }) {
      return nextContextProps.get(propName);
    },
    eventEmitter: form.eventEmitter
  }).subscribe(async ({ nextContextProps }) => {
    const nextFields = form.state.fields.set(fieldPath, nextContextProps);
    const safeFields = ensafeMap(nextFields, refs);

    const nextPropValue = resolver({
      fieldProps: fieldProps.toJS(),
      fields: safeFields.toJS(),
      form
    }, form.context);

    // console.warn('Should update `%s` of `%s` to `%s', rxPropName, subscriberPath.join('.'), nextPropValue);

    const { nextFieldProps: updatedFieldProps } = await form.updateField({
      fieldPath: subscriberFieldPath,
      propsPatch: { [rxPropName]: nextPropValue }
    });

    form.validateField({
      force: true,
      fieldPath: subscriberFieldPath,
      fieldProps: updatedFieldProps,
      forceProps: true,
      fields: nextFields
    });
  });
}

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
 * @param {Map} fieldProps
 * @param {Map} fields
 * @param {ReactElement} form
 */
export default function createSubscriptions({ fieldProps, fields, form }) {
  const rxProps = fieldProps.get('reactiveProps');
  if (!rxProps) return;

  const fieldPath = fieldProps.get('fieldPath');
  const resolverArgs = {
    fieldProps,
    fields,
    form
  };

  rxProps.forEach((resolver, rxPropName) => {
    const { refs, initialValue } = flushFieldRefs(resolver, resolverArgs);

    /* Resolve the initial value of the reactive prop */
    form.updateField({
      fieldPath: fieldProps.get('fieldPath'),
      propsPatch: { [rxPropName]: initialValue }
    });

    const formattedRefs = formatRefs(refs);
    formattedRefs.forEach((props, gluedFieldPath) => {
      const refFieldPath = gluedFieldPath.split('.');

      if (fields.hasIn(refFieldPath)) {
        return createObserver({
          fieldPath: refFieldPath,
          props,
          refs,
          rxPropName,
          resolver,
          fieldProps,
          form
        });
      }

      /**
       * Create a delegated target field subscription.
       * When the target field is not yet registred, create an observable to listen for its registration event.
       * Upon that even, resolve the reactive prop value once more, analyze it's dependencies, and get the ones
       * relevant to the delegated target field. Then, remove the delegated subscription and create a full-scale
       * target field props change observable.
       */
      const fieldRegisteredEvent = camelize(refFieldPath, 'registered');
      const delegatedSubscription = Observable.fromEvent(form.eventEmitter, fieldRegisteredEvent)
        .subscribe((delegatedFieldProps) => {
          /* Get rid of delegated subscription since it's no longer relevant */
          delegatedSubscription.unsubscribe();

          const { fields: currentFields } = form.state;
          const { refs } = flushFieldRefs(resolver, resolverArgs);
          const formattedRefs = formatRefs(refs);
          const props = formattedRefs.get(refFieldPath);

          const subscription = createObserver({
            fieldPath: refFieldPath,
            props,
            refs,
            rxPropName,
            resolver,
            fieldProps,
            form
          });

          return subscription.next({ nextContextProps: delegatedFieldProps });
        });
    });

    return;
  });
}
