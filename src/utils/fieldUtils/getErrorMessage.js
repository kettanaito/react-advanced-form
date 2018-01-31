import invariant from 'invariant';
import { customRulesKey } from './validate';

function resolveMessage({ messages, rejectedRule, resolverArgs }) {
  const { fieldProps } = resolverArgs;
  const { name, selector, isCustom } = rejectedRule;

  const primitiveErrorType = isCustom ? 'invalid' : name;
  const path = isCustom ? [customRulesKey, name] : [name];

  console.log(' ');
  console.warn('resolveMessage');
  console.log('name:', name);
  console.log('path:', path);
  console.log('selector:', selector);
  console.log('isCustom:', isCustom);

  const messagePaths = [
    selector && [selector, fieldProps[selector], ...path],
    ['name', fieldProps.name, primitiveErrorType],
    ['type', fieldProps.type, primitiveErrorType],
    ['general', primitiveErrorType]
  ].filter(Boolean);

  console.log('messagePaths:', messagePaths);

  for (let i = 0; i < messagePaths.length; i++) {
    const messagePath = messagePaths[i];
    const message = messages.getIn(messagePath);
    if (message) return message;
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
  const rejectedRules = validationResult.get('rejectedRules');
  if (!rejectedRules || (rejectedRules.length === 0)) return;

  const resolverArgs = {
    // ...extra,
    value: fieldProps.get('value'),
    fieldProps: fieldProps.toJS(),
    fields: fields.toJS(),
    form
  };

  let hasNamedMessage = false;

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

    invariant(isMessageValid, `Expected the error message declaration of the rule "${rejectedRule.name}" to return a String, but got: ${resolvedMessage}. Please check the message declaration for the field "${fieldProps.get('name')}".`);

    return resolvedMessage ? messagesList.concat(resolvedMessage) : messagesList;
  }, []);

  return resolvedMessages;
}
