function getFallbackMessage({ errorPath, messages, fieldProps }) {
  const errorType = errorPath[errorPath.length - 1];
  const primitiveErrorType = ['missing', 'invalid'].includes(errorType) ? errorType : 'invalid';

  const fallbackPaths = [
    ['name', fieldProps.get('name'), errorType],
    ['name', fieldProps.get('name'), primitiveErrorType],
    ['type', fieldProps.get('type'), errorType],
    ['type', fieldProps.get('type'), primitiveErrorType],
    ['general', primitiveErrorType],
  ];

  for (let i = 0; i < fallbackPaths.length; i++) {
    const fallbackPath = fallbackPaths[i];
    const message = messages.getIn(fallbackPath);

    if (message) {
      return message;
    }
  }
}

/**
 * Returns an error message based on the validity status and provided map of error messages.
 * @param {Map} validationResult
 * @param {Map} messages
 * @param {Map} fieldProps
 * @param {object} form
 * @return {Array<string>}
 */
export default function getErrorMessage({ validationResult, messages, fieldProps, fields, form }) {
  /* No errors - no error messages */
  const errorPaths = validationResult.get('errorPaths');
  if (!errorPaths) return;

  const messageResolverArgs = {
    // ...extra,
    value: fieldProps.get('value'),
    fieldProps: fieldProps.toJS(),
    fields: fields.toJS(),
    form
  };

  console.log('validationResult', validationResult.toJS());

  const resolvedMessages = errorPaths.reduce((messagesList, errorPath) => {
    /* Attempt to grab root level message declaration */
    const message = messages.getIn(errorPath);

    if (!message) {
      /* Try to fallback to the "invalid" key of the current selector */
      const fallbackMessage = getFallbackMessage({ errorPath, messages, fieldProps });
      return fallbackMessage ? messagesList.concat(fallbackMessage) : messagesList;
    }

    /* Resolve the message if it's a function */
    const resolvedMessage = (typeof message === 'function')
      ? message(messageResolverArgs)
      : message;

    return messagesList.concat(resolvedMessage);
  }, []);

  return resolvedMessages;
}
