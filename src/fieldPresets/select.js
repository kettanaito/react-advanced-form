export default {
  mapPropsToField({ fieldRecord, props: { children, initialValue } }) {
    return {
      ...fieldRecord,
      initialValue:
        initialValue || (children && children[0] && children[0].value),
    }
  },
  enforceProps({ props }) {
    return {
      size: props.size,
      multiple: props.multiple,
    }
  },
}
