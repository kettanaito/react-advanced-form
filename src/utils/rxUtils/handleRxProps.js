import { Observable } from 'rxjs/Observable';
import camelize from '../camelize';
import warn from '../warn';

export default function handleRxProps({ fieldProps, fields, form }) {
  /* Bypass the field without any reactive props */
  if (!fieldProps.has('reactiveProps')) return;

  fieldProps.get('reactiveProps').forEach((rxPropValue, rxPropName) => {
    console.log({ rxPropName, rxPropValue });
    const resolvedValue = rxPropValue({ fieldProps, fields, form });

    warn(resolvedValue, 'Cannot resolve the dynamic prop `%s` of the field `%s`.' +
    'Expected the prop value resolver to return something, but got: %s.',
    rxPropName, fieldProps.get('name'), resolvedValue);

    if (!resolvedValue) return;

    if (resolvedValue.hasOwnProperty('target')) {
      const { target, createObserver } = resolvedValue;

      const subscription = createObserver({
        subscriber: fieldProps.get('fieldPath'),
        rxPropName
      });

      /**
       * Resolve the initial value of the reactive prop.
       * When the target field is not yet registered within the form, assume an empty Object
       * to resolve into the falsy value.
       */
      if (fields.hasIn([target])) {
        return subscription.next(fields.getIn([target]).toJS());
      }

      console.log('Should create a delegated listener');

      Observable.fromEvent(form.eventEmitter, camelize(target, 'registered')).subscribe((targetProps) => {
        console.warn('Delegated update prop `%s` of field `%s`', rxPropName, fieldProps.get('fieldPath'));
        subscription.next(targetProps.toJS());
      });
    }
  });
}
