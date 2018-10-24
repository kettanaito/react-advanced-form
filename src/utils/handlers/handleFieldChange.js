import invariant from 'invariant'
import compose from 'ramda/src/compose'
import dispatch from '../dispatch'
import * as recordUtils from '../recordUtils'
import validateSync from '../validation/validateSync'
import validateField from './validateField'

export default async function handleFieldChange(
  payload,
  fields,
  form,
  { onUpdateValue },
) {
  const { isForcedUpdate, prevValue, nextValue, fieldProps } = payload
  const { controlled, onChange } = fieldProps

  /**
   * Handle "onChange" events dispatched by the controlled field.
   * Controlled field must execute its custom "CustomField.props.onChange" handler since
   * that is the updater for the source (i.e. state) controlling its value. Internal
   * RAF change handling must be omitted in that scenario, as it will be bubbled to
   * eventually via "createField.Field.componentReceiveProps()", when comparing previous
   * and next values of controlled fields.
   *
   * The value change flow for controlled fields is as follows:
   * 1. Change triggers "createField.handleChange"
   * 2. Emits default (not forced) "fieldChange" event
   * 3. Propagates to "handleFieldChange" (here)
   * 4. Dispatches custom "onChange" handlers ("CustomField.props.onChange")
   * 5. Handler updates the value, next value propagates to a field via cWRP.
   * 6. On cWRP emits FORCED "fieldChange" event for controlled fields.
   * 7. Bubbles again to "handleFieldChange" (here)
   * 8. Since event is forced, bypasses the controlled check and updates the field.
   * 9. Updated state of the controlled field is preset in the form's state.
   */
  if (!isForcedUpdate && controlled) {
    invariant(
      onChange,
      'Cannot update the controlled field `%s`. Expected custom `onChange` handler, ' +
        'but got: %s.',
      fieldProps.fieldPath.join('.'),
      onChange,
    )

    console.log(
      '(!) handleFieldChange: is NOT forced, and IS controlled: returning...',
    )

    dispatch(
      onChange,
      {
        nextValue,
        prevValue,
        fieldProps,
        fields,
        form,
      },
      form.context,
    )

    return null
  }

  console.log('handleFieldChange: proceeding by default...')

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
  if (!controlled) {
    dispatch(
      onChange,
      {
        nextValue,
        prevValue,
        fieldProps: validatedFieldProps,
        fields: form.state.fields,
        form,
      },
      form.context,
    )
  }

  return validatedFieldProps
}
