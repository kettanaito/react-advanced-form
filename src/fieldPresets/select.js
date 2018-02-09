export default {
  mapPropsToField: ({ fieldRecord, props: { children, initialValue } }) => ({
    ...fieldRecord,
    initialValue: initialValue || (children && children[0] && children[0].value)
  })
};
