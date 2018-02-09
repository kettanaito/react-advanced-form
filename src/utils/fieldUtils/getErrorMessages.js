import invariant from 'invariant';
import { customRulesKey } from './validate';

function resolveMessage({ messages, rejectedRule, resolverArgs }) {
  const { fieldProps } = resolverArgs;
  const { name, selector, isCustom } = rejectedRule;

  //
  // Async rejected rule breaks here.
  // If it's "isCustom", it will prompt to get a general "invalid" message, which is wrong.
  // If it's not custom, it will attempt named "async" message, but if missing - it will
  // return nothing, because it doesn't fallback to "name, invalid" message.
  //
  const primitiveErrorType = isCustom ? 'invalid' : name;
  const path = isCustom ? [customRulesKey, name] : [name];

  const messagePaths = [
    ['name', fieldProps.name, primitiveErrorType],
    ['type', fieldProps.type, primitiveErrorType],
    ['general', primitiveErrorType]
  ];

  if (selector) {
    messagePaths.unshift([selector, fieldProps[selector], ...path]);
  } else if (name === 'async') {
    /* In case of async rejected rule, prepend the name-specific "async" message key */
    messagePaths.unshift(['name', fieldProps.name, name]);
  }

  /* Iterate through each message path and return at the first match */
  for (let i = 0; i < messagePaths.length; i++) {
    const messagePath = messagePaths[i];
    const message = messages.getIn(messagePath);

    if (message) {
      return {
        message,
        isResolvedDirectly: (i === 0) };
    }
  }

  return {};
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

  /* Get the extra properties coming from the async validation result */
  const extra = validationResult.get('extra');

  const resolverArgs = {
    ...extra,
    value: fieldProps.get('value'),
    fieldProps: fieldProps.toJS(),
    fields: fields.toJS(),
    form
  };

  const resolvedMessages = rejectedRules.reduce((messagesList, rejectedRule, ruleIndex) => {
    const { message, isResolvedDirectly } = resolveMessage({ messages, rejectedRule, resolverArgs });

    /**
     * Bypass indirectly resolved messages which are coming after the primary (0) rule.
     * Indirectly resolved messages serve as helpers when there are no direct messages.
     * In case direct messages are present, displaying the indirect ones is confusing.
     */
    if (ruleIndex > 0 && !isResolvedDirectly) {
      return messagesList;
    }

    const isFunctionalMessage = (typeof message === 'function');
    const resolvedMessage = isFunctionalMessage ? message(resolverArgs) : message;

    const isMessageValid = isFunctionalMessage ? !!resolvedMessage : true;

    /* Throw on functional messages that return falsy values */
    invariant(isMessageValid, 'Expected the error message declaration of the rule `%s` to return a String, ' +
    'but got: %s. Please check the message declaration for the field `%s`.',
    rejectedRule.name, resolvedMessage, fieldProps.get('name'));

    return resolvedMessage ? messagesList.concat(resolvedMessage) : messagesList;
  }, []);

  return resolvedMessages;
}
