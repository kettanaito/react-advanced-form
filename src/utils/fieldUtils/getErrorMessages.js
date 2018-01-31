import invariant from 'invariant';
import { customRulesKey } from './validate';

function resolveMessage({ messages, rejectedRule, resolverArgs }) {
  const { fieldProps } = resolverArgs;
  const { name, selector, isCustom } = rejectedRule;

  const primitiveErrorType = isCustom ? 'invalid' : name;
  const path = isCustom ? [customRulesKey, name] : [name];

  const messagePaths = [
    ['name', fieldProps.name, primitiveErrorType],
    ['type', fieldProps.type, primitiveErrorType],
    ['general', primitiveErrorType]
  ];

  if (selector) {
    messagePaths.unshift([selector, fieldProps[selector], ...path]);
  }

  /* Iterate through each message path and return at the first match */
  for (let i = 0; i < messagePaths.length; i++) {
    const messagePath = messagePaths[i];
    const message = messages.getIn(messagePath);
    if (message) return message;
  }
}

/**
 * Returns the list of error messages on the validation results (rejected rules).
 * @param {Map} validationResult
 * @param {Map} messages
 * @param {Map} fieldProps
 * @param {object} form
 * @return {Array<string>}
 */
export default function getErrorMessages({ validationResult, messages, fieldProps, fields, form }) {
  /* No errors - no error messages */
  const rejectedRules = validationResult.get('rejectedRules');
  if (!rejectedRules || (rejectedRules.length === 0)) return;

  const resolverArgs = {
    // ...extra,
    value: fieldProps.get('value'),
    fieldProps: fieldProps.toJS(),
    fields: fields.toJS(),
    form
  };

  const resolvedMessages = rejectedRules.reduce((messagesList, rejectedRule) => {
    const message = resolveMessage({
      messages,
      rejectedRule,
      resolverArgs
    });

    const isFunctionalMessage = (typeof message === 'function');
    const resolvedMessage = isFunctionalMessage
      ? message(resolverArgs)
      : message;

    const isMessageValid = isFunctionalMessage ? !!resolvedMessage : true;

    /* Throw on functional messages that return falsy values */
    invariant(isMessageValid, `Expected the error message declaration of the rule "${rejectedRule.name}" to return a String, but got: ${resolvedMessage}. Please check the message declaration for the field "${fieldProps.get('name')}".`);

    return resolvedMessage ? messagesList.concat(resolvedMessage) : messagesList;
  }, []);

  return resolvedMessages;
}
