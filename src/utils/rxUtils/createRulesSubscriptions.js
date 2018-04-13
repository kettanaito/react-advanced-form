import makeObservable from './makeObservable';
import flushFieldRefs from '../flushFieldRefs';
import getFieldRules from '../formUtils/getFieldRules';

//
// TODO
// Change rule subscriptions according to new "getFieldProp" API
//

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
      return {
        ...ruleParams,
        refs: flushFieldRefs(ruleParams.resolver, resolverArgs)
      };
    }
  });

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
