import createEvent from './createEvent';

export default function handlePropsChange({ eventEmitter, subscriptions, fieldPath, fieldProps, prevFieldProps = null }) {
  if (!subscriptions) return;

  const relevantSubscription = subscriptions.getIn([fieldPath]);

  // console.log({ fieldPath });
  // console.log({ subscriptions });
  // console.log({ relevantSubscription });

  if (!relevantSubscription) return;

  const subscribedProps = relevantSubscription.get('props');
  const subscribers = relevantSubscription.get('subscribers');

  // console.log({ subscribedProps: subscribedProps && subscribedProps.toJS() });

  subscribedProps.forEach((propName) => {
    const nextPropValue = fieldProps.get(propName);

    const shouldEmitEvent = prevFieldProps ? (prevFieldProps.get(propName) !== nextPropValue) : true;
    if (!shouldEmitEvent) return;

    const propChangeEvent = createEvent(fieldPath, propName, 'change');
    eventEmitter.emit(propChangeEvent, { [propName]: nextPropValue });
  });
}
