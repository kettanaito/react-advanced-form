export default {
  valuePropName: 'checked',
  initialValue: false,
  mapPropsToField({ props: { checked }, fieldRecord }) {
    return {
      ...fieldRecord,
      type: 'checkbox',
      checked: !!checked,
      initialValue: checked
    };
  },
  enforceProps({ contextProps }) {
    return {
      checked: contextProps.get('checked')
    };
  },
  shouldValidateOnMount() {
    return false;
  }
};
