import { Observable } from 'rxjs/Observable';
import addPropsObserver from './addPropsObserver';
import dispatch from '../dispatch';
import camelize from '../camelize';
import createProxy from '../createProxy';

/**
 * Analyzes the provided resolver function and returns the targets (dependencies) map and its initial value.
 * @param {Function} resolver
 * @param {Map} fieldProps
 * @param {Map} fields
 * @param {ReactElement} form
 */
function analyzeResolver({ resolver, fieldProps, fields, form }) {
  const targetsMap = {};

  /* First, proxy each field record to know which props are accessed in the resolver function */
  const fieldsPropsProxy = fields.map(fieldProps => createProxy(fieldProps, {
    onGetProp({ target, propName }) {
      const targetPath = target.get('fieldPath');
      const targetProps = targetsMap[targetPath] || [];

      if (targetProps.includes(propName)) return;

      targetProps.push(propName);
      targetsMap[targetPath] = targetProps;
    }
  }));

  const initialValue = resolver({
    fieldProps,
    /* Then, proxy all fields Object to know which field is being accessed in the resolver function */
    fields: createProxy(fieldsPropsProxy, {
      onGetProp({ propName: targetPath }) {
        if (Object.keys(targetsMap).includes(targetPath)) return;
        targetsMap[targetPath] = null;
      }
      // getValue({ propValue }) {
      //   return withImmutable ? propValue : propValue.toJS();
      // },
    }),
    form
  });

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
  const fieldPath = fieldProps.get('fieldPath');

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
  }).subscribe(({ nextContextProps }) => {
    const nextFields = form.state.fields.set(targetPath, nextContextProps);
    const nextPropValue = dispatch(resolver, { fieldProps, fields: nextFields, form }, form.context);

    console.warn('Should update `%s` to `%s`', rxPropName, nextPropValue);

    form.updateField({
      fieldPath,
      propsPatch: { [rxPropName]: nextPropValue }
    });

    // TODO Review when the validation is needed
    // form.validateField({
    //   fieldPath,
    //   fieldProps: updatedFieldProps,
    //   forceProps: true
    // });
  });
}

/**
 * @param {Map} fieldProps
 * @param {Map} fields
 * @param {ReactElement} form
 */
export default function handleRxProps({ fieldProps, fields, form }) {
  const rxProps = fieldProps.get('reactiveProps');
  if (!rxProps) return;

  const fieldPath = fieldProps.get('fieldPath');

  rxProps.forEach((resolver, rxPropName) => {
    /* Get the targets map and initial prop value from the resolver */
    const { targetsMap, initialValue } = analyzeResolver({ resolver, fieldProps, fields, form });

    /* Resolve the value of the reactive prop initially */
    form.updateField({
      fieldPath,
      propsPatch: { [rxPropName]: initialValue }
    });

    console.log({ targetsMap });

    const targetsPaths = Object.keys(targetsMap);
    if (targetsPaths.length === 0) return;

    targetsPaths.forEach((targetPath) => {
      const targetProps = targetsMap[targetPath];

      if (targetProps) {
        return createObserver({ targetPath, targetProps, rxPropName, resolver, fieldProps, form });
      }

      /**
       * Create a delegated target field subscription.
       * When the target field is not yet registred, create an observable to listen for its registration event.
       * Upon that even, resolve the reactive prop value once more, analyze it's dependencies, and get the ones
       * relevant to the delegated target field. Then, remove the delegated subscription and create a full-scale
       * target field props change observable.
       */
      const fieldRegisteredEvent = camelize(targetPath, 'registered');
      const delegatedSubscription = Observable.fromEvent(form.eventEmitter, fieldRegisteredEvent)
        .subscribe((delegatedField) => {
          delegatedSubscription.unsubscribe();

          const { fields: currentFields } = form.state;
          const { targetsMap } = analyzeResolver({ resolver, fieldProps, fields: currentFields, form });
          const targetProps = targetsMap[targetPath];

          const subscription = createObserver({ targetPath, targetProps, rxPropName, resolver, fieldProps, form });
          return subscription.next({ nextContextProps: delegatedField });
        });
    });
  });
}
