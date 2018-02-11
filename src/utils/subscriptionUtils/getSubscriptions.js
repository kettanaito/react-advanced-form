import { Map, List } from 'immutable';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
// import createEvent from './createEvent';
import addPropsListener from './addPropsListener';

export default function getSubscriptions({ subscriptions, subscribe, fieldProps, fields, form }) {
  /* Bypass field with no reactive props */
  if (!fieldProps.has('reactiveProps')) return subscriptions;

  const fieldPath = fieldProps.get('fieldPath');

  return fieldProps.get('reactiveProps').reduce((nextSubscriptions, rxPropValue, rxPropName) => {
    /**
     * Execute the reactive prop value.
     * The resolver function must return an interface of `field.subscribe()` method. This way the target
     * field becomes exposed to the context of current iteration, as well as the subscribed props and the
     * actual value resolver, which is defined inside `field.subscribe(props: string[], resolver: Function)`.
     */
    const originPayload = rxPropValue({
      fieldProps,
      fields: fields.toJS(),
      form: this
    });
    if (!originPayload) return;

    const { props: subscribedProps, fieldPath: subscribedFieldPath, resolver } = originPayload;

    // const subscribedFieldProps = fields.getIn([subscribedFieldPath]);

    console.log('should add props listener');
    console.log({ subscribedProps })

    addPropsListener({
      fieldPath: subscribedFieldPath,
      props: subscribedProps,
      subscriber: fieldPath,
      resolver: (observer) => {
        observer.debounceTime(250).subscribe(changedProps => subscribe({
          rxPropName,
          rxPropValue,
          resolver,
          changedProps,
          resolvedPropValue: resolver(changedProps)
        }));
      },
      eventEmitter: form.eventEmitter
    });

    // subscribedProps.forEach((subscribedPropName) => {
    //   console.log('subscribed to:', subscribedFieldProps && subscribedFieldProps.toJS());
    //   console.log('should subscribe to', subscribedPropName, 'of the field:', subscribedFieldPath);

    //   const propChangeEvent = createEvent(
    //     subscribedFieldProps.get('fieldPath'),
    //     subscribedPropName,
    //     'change'
    //   );

    //   /**
    //    * Create an observer which litens to the subscribed props changes, debounces their events
    //    * and updates the subscribed field upon the change.
    //    */
    //   const onPropsChange = Observable.fromEvent(form.eventEmitter, propChangeEvent) //.debounceTime(250);

    //   /**
    //    * Subscribe to the props change event.
    //    * Listen to the change event emitted upon the change of the subscribed props and update the
    //    * subscribed field based on the next values of those props.
    //    */
    //   onPropsChange.subscribe((changedProps) => {
    //     const resolvedPropValue = resolver(changedProps);
    //     return subscribe({
    //       rxPropName,
    //       rxPropValue,
    //       resolver,
    //       changedProps,
    //       resolvedPropValue
    //     });
    //   });
    // });

    const prevSubscription = nextSubscriptions.getIn([subscribedFieldPath]) || Map({
      subscribers: List(),
      props: List()
    });

    const nextSubscription = prevSubscription
      .update('subscribers', subscribers => subscribers.push(fieldPath))
      .update('props', props => props.push(...subscribedProps));

    return nextSubscriptions.setIn([subscribedFieldPath], nextSubscription);
  }, subscriptions);
}
