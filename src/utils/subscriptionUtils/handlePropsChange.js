import createEvent from './createEvent';

export default function handlePropsChange({ eventEmitter, subscriptions, fieldProps, prevFieldProps = null }) {
  if (!subscriptions) return;

  const relevantSubscription = subscriptions.getIn([fieldProps.get('fieldPath')]);
  if (!relevantSubscription) return;

  const subscribedProps = relevantSubscription.get('props');
  const subscribers = relevantSubscription.get('subscribers');

  subscribedProps.forEach((propName) => {
    const nextPropValue = fieldProps.get(propName);
    const shouldEmitEvent = prevFieldProps
      ? (prevFieldProps.get(propName) !== nextPropValue)
      : true;

    if (!shouldEmitEvent) return;

    const propChangeEvent = createEvent(fieldProps.get('fieldPath'), propName, 'change');
    eventEmitter.emit(propChangeEvent, { [propName]: nextPropValue });
  });
}
