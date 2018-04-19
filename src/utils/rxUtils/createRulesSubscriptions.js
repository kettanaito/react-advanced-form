import makeObservable from './makeObservable';
import flushFieldRefs from '../flushFieldRefs';
import getFieldRules from '../formUtils/getFieldRules';

/**
 * Appends the "Field.props.rule" resolver function to the provided
 * rule groups in case the resolver is a reactive function.
 * @param {Map} ruleGroups
 * @param {Map} fieldProps
 * @param {Object} resolverArgs
 * @returns {Map}
 */
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

  /**
   * Get the collection of reactive rules from the form validation schema
   * relative to the registered field.
   */
  const schemaRuleGroups = getFieldRules({
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

  /**
   * Add "Field.props.rule" in case the latter has field references.
   */
  const ruleGroups = addFieldPropsRule(schemaRuleGroups, fieldProps, resolverArgs);

  if (ruleGroups.size === 0) {
    return rxRules;
  }

  /**
   * Create observable for each rule where another field(s) is referenced.
   * The observable will listen for the referenced props change event and re-evaluate
   * the validation rule(s) where that prop is referenced.
   */
  ruleGroups.forEach((ruleGroup) => {
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
