import makeObservable from '../makeObservable';

export default function _abc({ fieldProps, fields, form }) {
  const { rxRules } = form.state;

  const nameKeyPath = ['name', fieldProps.get('name')];
  const rule = form.formRules.getIn(nameKeyPath);
  if (!rule) {
    return rxRules;
  }

  const ruleArgs = { fieldProps, fields, form };
  const { refs } = makeObservable(rule, ruleArgs, {
    subscribe() {
      console.warn('Should validate', fieldProps.get('fieldPath'));
      form.eventEmitter.emit('validateField', { fieldProps, force: true });
    }
  });

  return rxRules.setIn(nameKeyPath, refs);
}
