import { Observable } from 'rxjs/Observable';
import addPropsObserver from './addPropsObserver';
import dispatch from '../dispatch';
import camelize from '../camelize';
import createProxy from '../createProxy';

/**
 * Returns the target (dependencies) map of the provided resolver and its initial value.
 * @param {Function} resolver
 * @param {Map} fieldProps
 * @param {Map} fields
 * @param {ReactElement} form
 */
function analyzeResolver({ resolver, fieldProps, fields, form }) {
  const targetsMap = {};
  const { withImmutable } = form.context;

  const fooFields = fields.map(fieldProps => createProxy(fieldProps, {
    onGetProp({ target, propName }) {
      const targetPath = target.get('fieldPath');

      console.log('Accessing the prop `%s`', propName, target.get('fieldPath'));

      const targetProps = targetsMap[targetPath] || [];
      if (targetProps.includes(propName)) return;

      targetProps.push(propName);
      targetsMap[targetPath] = targetProps;
    }
  }));

  const initialValue = resolver({
    fieldProps,
    fields: createProxy(fooFields, {
      onGetProp({ propName: targetPath }) {
        if (Object.keys(targetsMap).includes(targetPath)) return;
        targetsMap[targetPath] = null;
      },
      // getValue({ propValue }) {
      //   return withImmutable ? propValue : propValue.toJS();
      // },
    }),
    form
  });

  console.log({ initialValue });

  return { targetsMap, initialValue };
}

function createObserver({ targetPath, targetProps, rxPropName, resolver, fieldProps, form }) {
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
      fieldPath: fieldProps.get('fieldPath'),
      propsPatch: { [rxPropName]: nextPropValue }
    });
  });
}

/**
 * @param {Map} fieldProps
 * @param {Map} fields
 * @param {ReactElement} form
 */
export default function handleRxProps({ fieldProps, fields, form }) {
  const reactiveProps = fieldProps.get('reactiveProps');
  if (!reactiveProps) return;

  const fieldPath = fieldProps.get('fieldPath');
  const { eventEmitter } = form;

  reactiveProps.forEach((resolver, rxPropName) => {
    /* Get the targets map and initial prop value from the resolver */
    const { targetsMap, initialValue } = analyzeResolver({ resolver, fieldProps, fields, form });

    /* Update the reactive prop with the initial value of the resolver */
    form.updateField({
      fieldPath,
      propsPatch: { [rxPropName]: initialValue }
    });

    console.log({ targetsMap });

    Object.keys(targetsMap).forEach((targetPath) => {
      const targetProps = targetsMap[targetPath];

      if (targetProps) {
        return createObserver({ targetPath, targetProps, rxPropName, resolver, fieldProps, form });
      }

      console.log('Subscribed field `%s` is not mounted, creating a delegated observer...', targetPath);

      // Create a delegated observer when the target field gets registered
      const fieldRegisteredEvent = camelize(targetPath, 'registered');
      const delegatedSubscription = Observable.fromEvent(eventEmitter, fieldRegisteredEvent).subscribe((delegatedField) => {
        delegatedSubscription.unsubscribe();

        const { fields: currentFields } = form.state;
        console.log('Target field `%s` registered, should analyze resolver and resolve.', delegatedField.get('fieldPath'));

         const { targetsMap, initialValue } = analyzeResolver({ resolver, fieldProps, fields: currentFields, form });
         const targetProps = targetsMap[targetPath];

         const subscription = createObserver({ targetPath, targetProps, rxPropName, resolver, fieldProps, form });
         subscription.next({ nextContextProps: delegatedField });
      });
    });
  });
}
