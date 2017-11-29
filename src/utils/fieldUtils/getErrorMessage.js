/**
 * Returns a bypassed sync message, or resolved async message based on the custom resolvers.
 * @param {Map} message
 * @param {string} errorType
 * @param {Map} fieldProps
 * @param {object} formProps
 * @param {object?} extra
 * @return {string}
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

    /* Get the validation message from the custom resolver function */
    errorMessage = resolver({
      ...extra,
      value: fieldProps.get('value'),
      fieldProps: fieldProps.toJS(),
      formProps
    });

    if (!errorMessage) break;
  }

  return errorMessage;
}

/**
 * Returns an error message based on the validity status and provided map of error messages.
 * @param {object} validationResult
 * @param {Map} messages
 * @param {Map} fieldProps
 * @param {object} formProps
 * @return {string}
 */
export default function getErrorMessage({ validationResult, messages, fieldProps, formProps }) {
  const { errorType, extra } = validationResult;
  const fieldName = fieldProps.get('name');

  /**
   * Message paths.
   * Ordered collection of message paths to prompt in the provided "messages".
   */
  const messagePaths = [
    ['name', fieldName, errorType],
    ['type', fieldName, errorType],
    ['general', errorType]
  ];

  /* Iterate through each message path and break as soon as the message is found */
  for (let i = 0; i < messagePaths.length; i++) {
    const messagePath = messagePaths[i];
    const message = messages.getIn(messagePath);

    if (message) return resolveAsyncMessage({
      message,
      extra,
      errorType,
      fieldProps,
      formProps
    });
  }
}
