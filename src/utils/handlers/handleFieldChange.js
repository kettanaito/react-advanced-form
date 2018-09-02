import invariant from 'invariant'
import compose from 'ramda/src/compose'
import dispatch from '../dispatch'
import * as recordUtils from '../recordUtils'
import validateSync from '../validation/validateSync'
import validateField from './validateField'

export default async function handleFieldChange(
  { event, prevValue, nextValue, fieldProps },
  fields,
  form,
  { onUpdateValue },
) {
  /**
   * Handle "onChange" events dispatched by the controlled field.
   * Controlled field must execute its custom "CustomField.props.onChange" handler since
   * that is the updater for the source (i.e. state) controlling its value. Internal
   * RAF change handling must be omitted in that scenario, as it will be bubbled to
   * eventually via "createField.Field.componentReceiveProps()", when comparing previous
   * and next values of controlled fields.
   */
  const eventInstance = event.nativeEvent || event
  const isForcedUpdate = event && !eventInstance.isForcedUpdate
  const { controlled: isControlled, onChange: customChangeHandler } = fieldProps

  if (isForcedUpdate && isControlled) {
    invariant(
      customChangeHandler,
      'Cannot update the controlled field `%s`. Expected custom `onChange` handler, ' +
        'but got: %s.',
      fieldProps.fieldPath.join('.'),
      customChangeHandler,
    )

    return dispatch(
      customChangeHandler,
      {
        event,
        nextValue,
        prevValue,
        fieldProps,
        fields,
        form,
      },
      form.context,
    )
  }

  /* Update field's value */
  const updatedFieldProps = compose(
    recordUtils.setValue(nextValue),
    recordUtils.resetValidityState,
    recordUtils.resetValidationState,
  )(fieldProps)

  /* Cancel any pending async validation */
  const { pendingAsyncValidation } = updatedFieldProps

  if (pendingAsyncValidation) {
    pendingAsyncValidation.cancel()
  }

  if (onUpdateValue) {
    // TODO
    // Is this even needed?
    // Maybe, instead return the field props at this point and handle
    // callback call as a separate logic on top of each handler method.
    await onUpdateValue(updatedFieldProps)
  }

  /**
   * Determine whether to debounce the validation.
   * For example, for immediate clearing of field value the validation must be
   * performed immediately, while for typing the value it must be debounced.
   */
  const shouldDebounce = !!prevValue && !!nextValue
  const appropriateValidation = shouldDebounce
    ? fieldProps.debounceValidate
    : validateField

  const validatedFieldProps = await appropriateValidation({
    chain: [validateSync],
    fieldProps: updatedFieldProps,

    /**
     * Explicitly force field props, since "Form.validateField" will grab
     * the actual field props by field name from its state. This works unexpected
     * with concurrent validations (value updates).
     */
    // forceProps: true,

    //
    // NOTE
    // When passed explicitly here, the state of the fields
    // may be outdated.
    // I think it has to do with the debounce nature of this function call.
    // Internally, "validateField" referenced to the very same fields,
    // but at that moment their entries are up-to-date.
    //
    // fields: form.state.fields,
    form,
  })

  /**
   * Composition of the next field is irrelevant here.
   * Because "onUpdateValue" hook creates a side-effect fields update,
   * making the "fields" instance passed to "handleFieldChange" function
   * outdated.
   */
  // const nextFields = recordUtils.updateCollectionWith(nextFieldProps: validatedFieldProps, fields)

  /**
   * Call custom "onChange" handler for uncontrolled fields only.
   * "onChange" callback method acts as an updated function for controlled fields,
   * and as a callback function for uncontrolled fields. The value update of
   * uncontrolled fields is handled by the Form. Controlled fields dispatch
   * "onChange" handler at the beginning of this method. There is no need to
   * dispatch the handler method once more.
   */
  if (!isControlled) {
    dispatch(
      customChangeHandler,
      {
        event,
        nextValue,
        prevValue,
        fieldProps: validatedFieldProps,
        fields: form.state.fields,
        form,
      },
      form.context,
    )
  }

  return {
    nextFieldProps: validatedFieldProps,
  }
}
