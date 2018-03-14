import flushFieldRefs from '../flushFieldRefs';
import makeObservable from '../makeObservable';
import getFieldRules from '../formUtils/getFieldRules';

export default function createRulesSubscriptions({ fieldProps, fields, form }) {
  const { rxRules } = form.state;
  const value = fieldProps.get(fieldProps.get('valuePropName'));
  const resolverArgs = { value, fieldProps, fields, form };

  const ruleGroups = getFieldRules({
    fieldProps,
    schema: form.formRules,
    transformRule(defaultProps) {
      const { refs } = flushFieldRefs(defaultProps.resolver, resolverArgs);
      return { ...defaultProps, refs };
    }
  });

  if (ruleGroups.size === 0) {
    return rxRules;
  }

  /**
   * Create observable for each rule resolver function to watch for the referenced fields.
   */
  ruleGroups.forEach((ruleGroup) => {
    ruleGroup.forEach((rule) => {
      if (rule.refs.length === 0) {
        return;
      }

      makeObservable(rule.resolver, resolverArgs, {
        subscribe() {
          form.eventEmitter.emit('validateField', { fieldProps, force: true });
        }
      });
    });
  });

  return rxRules.mergeDeep(ruleGroups);
}
