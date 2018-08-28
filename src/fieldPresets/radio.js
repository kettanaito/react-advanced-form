export default {
  /**
   * There can be multiple radio fields with the same name represented by
   * a single field record entry in the form's state.
   */
  allowMultiple: true,

  /**
   * Handling of contextProps of Radio inputs is unique.
   * 1. Never pass "props.value" to context. <Field.Radio> is always expected
   * to receive a "value" prop, however it should never set it to context on
   * registration. The value in the context will be changed according to the
   * onChange handlers in the future.
   * 2. Determine "initialValue" based on optional "checked" prop.
   * 3. Add new "checked" props unique to this field type.
   */
  mapPropsToField({ fieldRecord, props: { checked, value, onChange } }) {
    fieldRecord.type = 'radio'
    fieldRecord.controlled = !!onChange

    delete fieldRecord.initialValue

    if (checked) {
      fieldRecord.initialValue = value
    } else {
      delete fieldRecord.value
    }

    return fieldRecord
  },

  /**
   * When the radio field with the same name is already registered, check if it
   * has some value in the record. Only radio fields with "checked" prop
   * propagate their value to the field's record, other radio fields are
   * registered, but their value is ignored.
   */
  beforeRegister({ fieldProps, fields }) {
    const { fieldPath } = fieldProps
    const alreadyExist = fields.hasIn(fieldPath)

    if (!alreadyExist) {
      return fieldProps
    }

    const valuePropName = fieldProps.get('valuePropName')
    const existingValue = fields.getIn([...fieldPath, valuePropName])

    if (existingValue) {
      return false
    }

    const fieldValue = fieldProps.get(valuePropName)
    return fieldValue ? fieldProps.set(valuePropName, fieldValue) : fieldProps
  },

  /**
   * Should update record.
   * Determines when it is needed to execute the native
   * "Form.handleFieldChange" during the "Field.componentWillReceiveProps"
   * for controlled fields.
   *
   * This is needed for the Radio field since on
   * "Field.componentWillReceiveProps" the "prevValue" and "nextValue" will
   * always be the same - Radio field controlled updates do NOT update the
   * value, but a "checked" prop. Regardless, what should be compared is the
   * next value and the current value in the field's record.
   */
  shouldUpdateRecord({ nextValue, nextProps, contextProps }) {
    return nextProps.checked && nextValue !== contextProps.get('value')
  },

  enforceProps: ({ props, contextProps }) => ({
    value: props.value,
    checked: contextProps.get('controlled')
      ? props.checked
      : props.value === contextProps.get('value'),
  }),
}
