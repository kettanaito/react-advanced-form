/**
 * Returns a bypassed sync message, or resolved async message based on the custom resolvers.
 */
function resolveAsyncMessage({ message, errorType, fieldProps, formProps, extra }) {
  /* Bypass synchronous messages */
  if (errorType !== 'async') return message;

  let errorMessage;
  const resolvers = message.toJS();
  const resolverNames = Object.keys(resolvers);

  for (let i = 0; i < resolverNames.length; i++) {
    const resolverName = resolverNames[i];
    const resolver = resolvers[resolverName];

    errorMessage = resolver({ ...extra, fieldProps, formProps });
    if (!errorMessage) break;
  }

  return errorMessage;
}

/**
 * Returns an error message based on the validity status and provided map of error messages.
 * @return {string}
 */
export default function getErrorMessage({ validationResult, messages, fieldProps, formProps }) {
  const { errorType, extra } = validationResult;
  const { name: fieldName } = fieldProps;

  const messagePaths = [
    /* Name-specific messages has the highest priority */
    ['name', fieldName, errorType],

    /* Type-specific messages has the middle priority */
    ['type', fieldName, errorType],

    /* General messages serve as the fallback ones */
    ['general', errorType]
  ];

  /* Iterate through each message path and break as soon as the message is found */
  for (let i = 0; i < messagePaths.length; i++) {
    const messagePath = messagePaths[i];
    const message = messages.getIn(messagePath);
    if (message) return resolveAsyncMessage({ message, extra, errorType, fieldProps, formProps });
  }
}
