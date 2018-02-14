import createEvent from './createEvent';

export default function handlePropsChange(args) {
  const { eventEmitter, subscriptions, fieldPath, fieldProps, prevFieldProps = null } = args;
  if (!subscriptions) return;

  const relevantSubscription = subscriptions.getIn([fieldPath]);

  // console.log({ fieldPath });
  // console.log({ subscriptions });
  // console.log({ relevantSubscription });

  if (!relevantSubscription) return;

  const subscribedProps = relevantSubscription.get('props');

  subscribedProps.forEach((propName) => {
    const nextPropValue = fieldProps.get(propName);

    const shouldEmitEvent = prevFieldProps ? (prevFieldProps.get(propName) !== nextPropValue) : true;
    if (!shouldEmitEvent) return;

    const propChangeEvent = createEvent(fieldPath, propName, 'change');
    eventEmitter.emit(propChangeEvent, { [propName]: nextPropValue });
  });
}
