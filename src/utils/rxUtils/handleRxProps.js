import { Observable } from 'rxjs/Observable';
import dispatch from '../dispatch';
import camelize from '../camelize';
import warn from '../warn';

export default function handleRxProps({ fieldProps, fields, form }) {
  /* Bypass the field without any reactive props */
  if (!fieldProps.has('reactiveProps')) return;

  fieldProps.get('reactiveProps').forEach((rxPropValue, rxPropName) => {
    const resolvedValue = dispatch(rxPropValue, { fieldProps, fields, form }, form.context);

    warn(resolvedValue, 'Cannot resolve the dynamic prop `%s` of the field `%s`. Expected the prop value resolver ' +
    'to return something, but got: %s.', rxPropName, fieldProps.get('name'), resolvedValue);

    if (!resolvedValue) return;

    //
    //
    // TODO What about functional reactive props not based on subscriptions? How those should be resolved?
    //
    //
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

      console.log('Target field does not exist, creating a delegated observer...');

      /**
       * Create a delegated prop resolver.
       * In case the target field doesn't exist at the moment, create an observer to listen to the event of its
       * registration, and resolve the reactive prop upon the target field's registration.
       */
      Observable.fromEvent(form.eventEmitter, camelize(target, 'registered')).subscribe((targetProps) => {
        console.warn('Delegated update prop `%s` of field `%s`', rxPropName, fieldProps.get('fieldPath'));

        subscription.next(targetProps.toJS());
      });
    }
  });
}
