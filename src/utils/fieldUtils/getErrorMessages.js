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
    if (message) return { message, isResolvedDirectly: (i === 0) };
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
  console.log('need to get error messages');
  console.log('has no rejected rules?', !rejectedRules || (rejectedRules.length === 0));
  console.log('current errors:', fieldProps.get('errors'));

  if (!rejectedRules || (rejectedRules.length === 0)) return;

  console.log('valid', validationResult && validationResult.toJS());

  const resolverArgs = {
    // ...extra,
    value: fieldProps.get('value'),
    fieldProps: fieldProps.toJS(),
    fields: fields.toJS(),
    form
  };

  let hasResolvedNameMessage = false;

  const resolvedMessages = rejectedRules.reduce((messagesList, rejectedRule) => {
    const { selector } = rejectedRule;
    const { message, isResolvedDirectly } = resolveMessage({ messages, rejectedRule, resolverArgs });

    const isNameSelector = (selector === 'name');

    /**
     * When no previously directly resolved messages, and the current one is directly resolved,
     * mark this within the respective variable.
     */
    if (!hasResolvedNameMessage && isNameSelector && isResolvedDirectly) {
      hasResolvedNameMessage = true;
    }

    /**
     * When current message is not resolved directly, yet there is a sibling message
     * which was resolved directly before, bypass the current message.
     */
    if (hasResolvedNameMessage && isNameSelector && !isResolvedDirectly) {
      return messagesList;
    }

    const isFunctionalMessage = (typeof message === 'function');
    const resolvedMessage = isFunctionalMessage ? message(resolverArgs) : message;

    const isMessageValid = isFunctionalMessage ? !!resolvedMessage : true;

    /* Throw on functional messages that return falsy values */
    invariant(isMessageValid, 'Expected the error message declaration of the rule `%s` to return a String, ' +
    'but got: %s. Please check the message declaration for the field `%s`.', rejectedRule.name, resolvedMessage, fieldProps.get('name'));

    return resolvedMessage ? messagesList.concat(resolvedMessage) : messagesList;
  }, []);

  console.log('resolvedMessages:', resolvedMessages);

  return resolvedMessages;
}
