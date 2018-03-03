import { Observable } from 'rxjs/Observable';
import addPropsObserver from './addPropsObserver';
import camelize from '../camelize';
import dispatch from '../dispatch';
import warn from '../warn';

/**
 * Generates a subscribe function ensuring the proxied interface.
 * @example subscribe('groupName', 'fieldName', 'propName');
 * @param {Map} fields
 * @param {Function} callback
 */
function generateSubscribe(fields, callback = null) {
  return function subscribe(...fieldPath) {
    const propName = fieldPath.pop();
    if (callback) callback({ fieldPath, propName });

    return fields.getIn([...fieldPath, propName]);
  };
}

/**
 * Analyzes the provided resolver function and returns the targets (dependencies) map and its initial value.
 * @param {Function} resolver
 * @param {Map} fieldProps
 * @param {Map} fields
 * @param {ReactElement} form
 */
function analyzeResolver({ rxPropName, resolver, fieldProps, fields, form }) {
  const targetsMap = {};

  const subscribe = generateSubscribe(fields, ({ fieldPath, propName }) => {
    const isValidPropName = fields.hasIn(fieldPath) ? fields.hasIn([...fieldPath, propName]) : true;
    warn(isValidPropName, 'Failed to resolve a reactive prop `%s` for the field `%s`. Expected the last parameter ' +
      'to be a valid prop name, but got: `%s`.', rxPropName, fieldProps.get('fieldPath').join('.'), propName);

    const gluedPath = fieldPath.join('.');
    const prevProps = targetsMap[gluedPath] || [];
    if (prevProps.includes(propName)) return;

    const nextProps = prevProps.concat(propName);
    targetsMap[gluedPath] = nextProps;
  });

  const initialValue = dispatch(resolver, { subscribe, fieldProps, form }, form.context);

  return { targetsMap, initialValue };
}

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
function createObserver({ targetPath, targetProps, rxPropName, resolver, fieldProps, form }) {
  const subscriberPath = fieldProps.get('fieldPath');

  return addPropsObserver({
    fieldPath: targetPath,
    props: targetProps,
    predicate({ propName, prevContextProps, nextContextProps }) {
      return (prevContextProps.get(propName) !== nextContextProps.get(propName));
    },
    getNextValue({ propName, nextContextProps }) {
      return nextContextProps.get(propName);
    },
    eventEmitter: form.eventEmitter
  }).subscribe(async ({ nextContextProps, shouldValidate = true }) => {
    const nextFields = form.state.fields.setIn(targetPath, nextContextProps);

    const nextPropValue = dispatch(resolver, {
      subscribe: generateSubscribe(nextFields),
      fieldProps: fieldProps.toJS(),
      form
    }, form.context);

    // console.warn('Should update `%s` of `%s` to `%s', rxPropName, subscriberPath.join('.'), nextPropValue);

    const { nextFieldProps: updatedFieldProps } = await form.updateField({
      fieldPath: subscriberPath,
      propsPatch: { [rxPropName]: nextPropValue }
    });

    if (shouldValidate) {
      form.validateField({
        force: true,
        fieldPath: subscriberPath,
        fieldProps: updatedFieldProps,
        forceProps: true,
        fields: nextFields
      });
    }
  });
}

/**
 * @param {Map} fieldProps
 * @param {Map} fields
 * @param {ReactElement} form
 */
export default function createSubscriptions({ fieldProps, fields, form }) {
  const rxProps = fieldProps.get('reactiveProps');
  if (!rxProps) return;

  rxProps.forEach((resolver, rxPropName) => {
    /* Get the targets map and initial prop value from the resolver */
    const { targetsMap, initialValue } = analyzeResolver({ rxPropName, resolver, fieldProps, fields, form });

    /* Resolve the value of the reactive prop initially */
    form.updateField({
      fieldPath: fieldProps.get('fieldPath'),
      propsPatch: { [rxPropName]: initialValue }
    });

    const targetsPaths = Object.keys(targetsMap);
    if (targetsPaths.length === 0) return;

    targetsPaths.forEach((gluedPath) => {
      const targetPath = gluedPath.split('.');
      const isTargetMounted = fields.hasIn(targetPath);

      if (isTargetMounted) {
        const targetProps = targetsMap[gluedPath];
        return createObserver({ targetPath, targetProps, rxPropName, resolver, fieldProps, form });
      }

      /**
       * Create a delegated target field subscription.
       * When the target field is not yet registred, create an observable to listen for its registration event.
       * Upon that even, resolve the reactive prop value once more, analyze it's dependencies, and get the ones
       * relevant to the delegated target field. Then, remove the delegated subscription and create a full-scale
       * target field props change observable.
       */
      const fieldRegisteredEvent = camelize(...targetPath, 'registered');

      const delegatedSubscription = Observable.fromEvent(form.eventEmitter, fieldRegisteredEvent)
        .subscribe((delegatedField) => {
          delegatedSubscription.unsubscribe();

          const { fields: nextFields } = form.state;
          const { targetsMap } = analyzeResolver({ rxPropName, resolver, fieldProps, fields: nextFields, form });
          const targetProps = targetsMap[gluedPath];

          /**
           * When the delegated reactive prop resolver executes, we need to determine whether the subscriber field
           * validation is needed. Validate the subscriber when it has any value, otherwise do not validate to
           * prevent invalid fields at initial form render.
           */
          const shouldValidate = !!fieldProps.get(fieldProps.get('valuePropName'));

          const subscription = createObserver({ targetPath, targetProps, rxPropName, resolver, fieldProps, form });
          return subscription.next({ nextContextProps: delegatedField, shouldValidate });
        });
    });
  });
}
