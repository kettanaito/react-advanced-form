/**
 * Returns a bypassed sync message, or resolved async message based on the custom resolvers.
 * @param {Map} message
 * @param {string} errorType
 * @param {Map} fieldProps
 * @param {object} form
 * @param {object?} extra
 * @return {string}
 */
function resolveAsyncMessage({ message, errorType, fieldProps, fields, form, extra }) {
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
      fields: fields.toJS(),
      form
    });

    if (!errorMessage) break;
  }

  return errorMessage;
}

/**
 * Returns an error message based on the validity status and provided map of error messages.
 * @param {object} validationPatch
 * @param {Map} messages
 * @param {Map} fieldProps
 * @param {object} form
 * @return {string}
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

  const resolvedMessages = errorPaths.reduce((messagesList, errorPath) => {
    /* Attempt to grab root level message declaration */
    const message = messages.getIn(errorPath);

    if (!message) {
      const fallbackMessage = messages.getIn([errorPath[0], errorPath[1], 'invalid']);
      return fallbackMessage ? messagesList.concat(fallbackMessage) : messagesList;
    }

    const resolvedMessage = (typeof message === 'function')
      ? message(messageResolverArgs)
      : message;

    return messagesList.concat(resolvedMessage);
  }, []);

  return resolvedMessages;

  /* Object.keys(errorType).forEach((ruleSelector) => {
    const invalidRules = errorType[ruleSelector];

    console.log(' ');
    console.warn('ruleSelector', `"${ruleSelector}"`);
    console.log('invalidRules', invalidRules);

    const resolvedMessages = invalidRules.reduce((all, rules) => {
      const message = messages.getIn([ruleSelector, fieldProps.get(ruleSelector), ...rules]);

      if (typeof message === 'function') {
        return all.concat(message(messageResolverArgs));
      }

      return all.concat(message);
    }, []);

    console.log('resolved messages:', resolvedMessages);
  }); */

  /**
   * Message paths.
   * Ordered collection of message paths to prompt in the provided "messages".
   */
  // const messagePaths = [
  //   ['name', fieldProps.get('name'), errorType],
  //   ['type', fieldProps.get('type'), errorType],
  //   ['general', errorType]
  // ];

  /* Iterate through each message path and break as soon as the message is found */
  // for (let i = 0; i < messagePaths.length; i++) {
  //   const messagePath = messagePaths[i];
  //   const message = messages.getIn(messagePath);

  //   if (message) {
  //     return resolveAsyncMessage({
  //       message,
  //       extra,
  //       errorType,
  //       fieldProps,
  //       fields,
  //       form
  //     });
  //   }
  // }
}
