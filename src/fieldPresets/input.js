export default {
  enforceProps({ props }) {
    return {
      accept: props.accept,
      placeholder: props.placeholder,
      maxLength: props.maxLength,
      autoComplete: props.autoComplete,
      multiple: props.multiple,
      step: props.step
    };
  }
};
