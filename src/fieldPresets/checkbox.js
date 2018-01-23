export default {
  valuePropName: 'checked',
  mapPropsToField: ({ props: { checked }, fieldRecord }) => ({
    ...fieldRecord,
    type: 'checkbox',
    initialValue: checked
  }),
  enforceProps: (props, contextProps) => ({
    checked: contextProps.get('checked')
  })
};
