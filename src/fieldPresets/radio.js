export default {
  /**
   * Handling of contextProps of  Radio inputs' is unique.
   * 1. Never pass "props.value" to context. <Field.Radio> is always expected to receive a "value" prop,
   * however it should never set it to context on registration. The value in the context will be changed
   * according to the onChange handlers in the future.
   * 2. Determine "initialValue" based on optional "checked" prop.
   * 3. Add new "checked" props unique to this field type.
   */
  mapPropsToField: ({ fieldRecord, props: { checked, value, onChange } }) => {
    fieldRecord.type = 'radio';
    fieldRecord.controllable = !!onChange;

    delete fieldRecord.initialValue;

    if (checked) {
      fieldRecord.initialValue = value;
    } else {
      delete fieldRecord.value;
    }

    return fieldRecord;
  },
  enforceProps: (props, contextProps) => ({
    value: props.value,
    checked: (props.value === contextProps.get('value'))
  })
};
