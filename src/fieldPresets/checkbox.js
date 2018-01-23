export default {
  valuePropName: 'checked',
  mapPropsToField: ({ props: { checked }, fieldRecord }) => ({
    ...fieldRecord,
    type: 'checkbox',
    checked,
    initialValue: checked
  }),
  enforceProps: (props, contextProps) => ({
    checked: contextProps.get('checked')
  })
};
