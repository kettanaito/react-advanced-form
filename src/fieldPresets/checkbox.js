export default {
  valuePropName: 'checked',
  initialValue: false,
  mapPropsToField: ({ props: { checked }, fieldRecord }) => ({
    ...fieldRecord,
    type: 'checkbox',
    checked: !!checked,
  }),
  enforceProps: ({ contextProps }) => ({
    checked: contextProps.checked,
  }),
  shouldValidateOnMount: () => false,
}
