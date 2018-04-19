import makeObservable from './makeObservable';
import flushFieldRefs from '../flushFieldRefs';
import getFieldRules from '../formUtils/getFieldRules';

function addFieldPropsRule(ruleGroups, fieldProps, resolverArgs) {
  const resolver = fieldProps.get('rule');

  if (typeof resolver !== 'function') {
    return ruleGroups;
  }

  const { refs } = flushFieldRefs(resolver, resolverArgs);

  return ruleGroups.set('rule', [{
    refs,
    resolver
  }]);
}

/**
 * Creates an observable for each validation rule which references other fields' props.
 * Flattens deep the validation schema, finding the rules relevant to the currently
 * registering field, and creates observables for those rules which reference another fields.
 * @param {Map} fieldProps
 * @param {Map} fields
 * @param {Object} form
 * @returns {Map}
 */
export default function createRulesSubscriptions({ fieldProps, fields, form }) {
  const { rxRules } = form.state;
  const value = fieldProps.get(fieldProps.get('valuePropName'));

  const resolverArgs = {
    value,
    fieldProps,
    fields,
    form
  };

  const ruleGroups = getFieldRules({
    fieldProps,
    schema: form.formRules,
    transformRule(ruleParams) {
      const { refs } = flushFieldRefs(ruleParams.resolver, resolverArgs);

      return {
        ...ruleParams,
        refs
      };
    }
  });

  //
  //
  // Any way to do this in one call?
  const finalRuleGroups = addFieldPropsRule(ruleGroups, fieldProps, resolverArgs);

  if (finalRuleGroups.size === 0) {
    return rxRules;
  }

  /**
   * Create observable for each rule where another field(s) is referenced.
   * The observable will listen for the referenced props change event and re-evaluate
   * the validation rule(s) where that prop is referenced.
   */
  finalRuleGroups.forEach((ruleGroup) => {
    ruleGroup.forEach((rule) => {
      /* Bypass rule resolvers without field references */
      if (rule.refs.length === 0) {
        return;
      }

      makeObservable(rule.resolver, resolverArgs, {
        subscribe() {
          form.eventEmitter.emit('validateField', {
            fieldProps,
            force: true
          });
        }
      });
    });
  });

  return rxRules.mergeDeep(ruleGroups);
}
