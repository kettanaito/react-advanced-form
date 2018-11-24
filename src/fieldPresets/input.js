export default {
  mapPropsToField: ({ props, fieldRecord }) => ({
    ...fieldRecord,
    type: props.type || 'text',
  }),
  enforceProps: ({ props }) => ({
    accept: props.accept,
    placeholder: props.placeholder,
    maxLength: props.maxLength,
    autoComplete: props.autoComplete,
    multiple: props.multiple,
    step: props.step,
  }),
}
