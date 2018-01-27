function getFallbackMessage({ errorPath, messages, fieldProps }) {
  const errorType = errorPath[errorPath.length - 1];
  const primitiveErrorType = ['missing', 'invalid'].includes(errorType) ? errorType : 'invalid';

  const fallbackPaths = [
    ['name', fieldProps.get('name'), errorType],
    ['name', fieldProps.get('name'), primitiveErrorType],
    ['type', fieldProps.get('type'), errorType],
    ['type', fieldProps.get('type'), primitiveErrorType],
    ['general', primitiveErrorType]
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
  if (!errorPaths || errorPaths.size === 0) return;

  const messageResolverArgs = {
    // ...extra,
    value: fieldProps.get('value'),
    fieldProps: fieldProps.toJS(),
    fields: fields.toJS(),
    form
  };

  let hasNamedMessage = false;

  const resolvedMessages = errorPaths.reduce((messagesList, errorPath) => {
    /* Attempt to get the message by "errorPath" directly */
    const message = messages.getIn(errorPath);

    /* Determine if this is the named error path */
    const errorPathType = errorPath[0];
    const isNamedPath = (errorPathType === 'name');
    const isTypedPath = (errorPathType === 'type');

    /* Bypass "type" error paths when named message is already present */
    if (isTypedPath && hasNamedMessage) return messagesList;

    /* Bypass missing named error path with the named message already present */
    if (!message && isNamedPath && hasNamedMessage) return messagesList;

    if (isNamedPath && message) {
      hasNamedMessage = true;
    }

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
