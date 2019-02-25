import * as R from 'ramda'
import invariant from 'invariant'
import dispatch from '../dispatch'
import * as recordUtils from '../recordUtils'
import validateSync from '../validation/validateSync'
import validateField from './validateField'

export default async function handleFieldChange(
  { event, prevValue, nextValue, fieldProps: fieldState },
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
  const eventInstance = event && (event.nativeEvent || event)
  const { isForcedUpdate } = eventInstance || {}
  const { controlled: isControlled, onChange } = fieldState

  if (!isForcedUpdate && isControlled) {
    invariant(
      onChange,
      'Cannot update the controlled field `%s`. Expected custom `onChange` handler, ' +
        'but got: %s.',
      fieldState.fieldPath.join('.'),
      onChange,
    )

    /**
     * Call custom "onChange" handler for uncontrolled fields only.
     * "onChange" callback method acts as an updated function for controlled fields,
     * and as a callback function for uncontrolled fields. The value update of
     * uncontrolled fields is handled by the Form. Controlled fields dispatch
     * "onChange" handler at the beginning of this method. There is no need to
     * dispatch the handler method once more.
     */
    dispatch(onChange, {
      event,
      nextValue,
      prevValue,
      fieldProps: fieldState,
      fields,
      form,
    })

    return
  }

  /* Update field's value */
  const fieldStatePatch = R.compose(
    recordUtils.setPristine(false),
    recordUtils.setValue(nextValue, fieldState),
    recordUtils.resetValidityState,
    recordUtils.resetValidationState,
  )({})

  const updatedFieldState = R.mergeDeepLeft(fieldStatePatch, fieldState)

  /* Cancel any pending async validation */
  const { pendingAsyncValidation } = fieldState

  if (pendingAsyncValidation) {
    pendingAsyncValidation.cancel()
  }

  if (onUpdateValue) {
    await onUpdateValue(fieldStatePatch)
  }

  /**
   * Determine whether to debounce the validation.
   * For example, for immediate clearing of field value the validation must be
   * performed immediately, while for typing the value it must be debounced.
   */
  const shouldDebounce = !!prevValue && !!nextValue
  const appropriateValidation = shouldDebounce
    ? fieldState.debounceValidate
    : validateField

  const validatedFieldState = await appropriateValidation({
    /* Prevent state update since "Form.handleFieldChange" updates state after validation */
    shouldUpdateFields: false,
    chain: [validateSync],
    fieldProps: updatedFieldState,
    form,
  })

  return validatedFieldState
}
