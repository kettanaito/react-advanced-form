import invariant from 'invariant';
import { customRulesKey } from './validate';
import warning from '../warning';
import dispatch from '../dispatch';

function resolveMessage({ messages, rejectedRule, fieldProps }) {
  const { name: ruleName, selector, isCustom } = rejectedRule;
  const fieldName = fieldProps.get('name');
  const fieldType = fieldProps.get('type');

  const primitiveErrorType = isCustom ? 'invalid' : ruleName;
  const path = isCustom ? [customRulesKey, ruleName] : [ruleName];

  const messagePaths = [
    ['name', fieldName, primitiveErrorType],
    ['type', fieldType, primitiveErrorType],
    ['general', primitiveErrorType]
  ];

  if (selector) {
    messagePaths.unshift([selector, fieldProps.get(selector), ...path]);
  } else if (ruleName === 'async') {
    /* In case of async rejected rule, prepend the name-specific "async" message key */
    messagePaths.unshift(['name', fieldName, ruleName]);
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

  const defaultResolverArgs = {
    value: fieldProps.get('value'),
    fieldProps,
    fields,
    form
  };
  const defaultResolverKeys = Object.keys(defaultResolverArgs);

  /* Get the extra properties coming from the async validation result */
  const extra = validationResult.get('extra');
  const extraKeys = extra && Object.keys(extra);
  const overridesExtras = extraKeys && extraKeys.some(extraKey => defaultResolverKeys.includes(extraKey));

  /* Warn about keys override */
  warning(!overridesExtras, 'Extra keys received from the async response %s overlap with the ' +
  'default resolver arguments %s. Note that the overlapping keys will be overriden in the `%s` field ' +
  'message resolver.', JSON.stringify(extraKeys), JSON.stringify(defaultResolverKeys),
  fieldProps.get('name'));

  const resolverArgs = {
    ...extra,
    ...defaultResolverArgs
  };

  const resolvedMessages = rejectedRules.reduce((messagesList, rejectedRule, ruleIndex) => {
    const { message, isResolvedDirectly } = resolveMessage({ messages, rejectedRule, fieldProps });

    /**
     * Bypass indirectly resolved messages which are coming after the primary (0) rule.
     * Indirectly resolved messages serve as helpers when there are no direct messages.
     * In case direct messages are present, displaying the indirect ones is confusing.
     */
    if ((ruleIndex > 0) && !isResolvedDirectly) {
      return messagesList;
    }

    const isResolver = (typeof message === 'function');
    const resolvedMessage = isResolver ? dispatch(message, resolverArgs, form.context) : message;
    const isMessageValid = isResolver ? !!resolvedMessage : true;

    /* Throw on functional messages that return falsy values */
    invariant(isMessageValid, 'Expected the error message declaration of the rule `%s` to return a String, ' +
    'but got: %s. Please check the message declaration for the field `%s`.',
    rejectedRule.name, resolvedMessage, fieldProps.get('name'));

    return resolvedMessage ? messagesList.concat(resolvedMessage) : messagesList;
  }, []);

  return resolvedMessages;
}
