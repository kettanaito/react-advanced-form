export default {
  valuePropName: 'checked',
  initialValue: false,
  mapPropsToField: ({ props: { checked, initialValue }, fieldRecord }) => ({
    ...fieldRecord,
    type: 'checkbox',
    checked: !!initialValue || !!checked,
  }),
  enforceProps: ({ contextProps }) => ({
    checked: contextProps.checked,
  }),
  shouldValidateOnMount: () => false,
}
