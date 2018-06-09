export default {
  valuePropName: 'checked',
  initialValue: false,
  mapPropsToField: ({ props: { checked }, fieldRecord }) => ({
    ...fieldRecord,
    type: 'checkbox',
    checked: !!checked,
    initialValue: checked,
  }),
  enforceProps: ({ contextProps }) => ({
    checked: contextProps.get('checked'),
  }),
  shouldValidateOnMount: () => false,
}
