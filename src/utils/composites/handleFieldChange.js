import invariant from 'invariant'
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
  console.groupCollapsed(
    `Form @ handleFieldChange @ ${fieldProps.displayFieldPath}`,
  )
  console.log('fieldProps', Object.assign({}, fieldProps.toJS()))
  console.log('nextValue', nextValue)
  console.groupEnd()

  /**
   * Handle "onChange" events dispatched by the controlled field.
   * Controlled field must execute its custom "CustomField.props.onChange" handler since
   * that is the updater for the source (i.e. state) controlling its value. Internal
   * RAF change handling must be omitted in that scenario, as it will be bubbled to
   * eventually via "createField.Field.componentReceiveProps()", when comparing previous
   * and next values of controlled fields.
   */
  const isForcedUpdate = event && !(event.nativeEvent || event).isForcedUpdate
  const isControlled = fieldProps.controlled
  const customChangeHandler = fieldProps.onChange

  if (isForcedUpdate && isControlled) {
    invariant(
      customChangeHandler,
      'Cannot update the controlled field `%s`. Expected custom `onChange` handler, ' +
        'but got: %s.',
      fieldProps.displayFieldPath,
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
  const updatedFieldProps = recordUtils.setValue(
    recordUtils.resetValidityState(
      recordUtils.resetValidationState(fieldProps),
    ),
    nextValue,
  )

  /* Cancel any pending async validation */
  const { pendingAsyncValidation } = updatedFieldProps
  if (pendingAsyncValidation) {
    pendingAsyncValidation.cancel()
  }

  if (onUpdateValue) {
    await onUpdateValue(updatedFieldProps)
  }

  /**
   * Determine whether to debounce the validation.
   * For example, for immediate clearing of field value the validation must be
   * performed immediately, while for typing the value it must be debounced.
   */
  const shouldDebounce = !!nextValue
  const appropriateValidation = shouldDebounce
    ? fieldProps.debounceValidate
    : validateField

  const nextFieldProps = await appropriateValidation({
    chain: [validateSync],
    fieldProps: updatedFieldProps,

    //
    // NOTE
    // When passed explicitly here, the state of the fields
    // may be outdated for some reason.
    // I think it has to do with the debounce nature of this function call.
    // Internally, "validateField" referenced to the very same fields,
    // but at that moment their entries are up-to-date.
    //
    // fields: this.state.fields,
    form,
  })

  const nextFields = recordUtils.updateCollectionWith(nextFieldProps, fields)

  /**
   * Call custom "onChange" handler for uncontrolled fields only.
   * "onChange" callback method acts as an updated function for controlled fields,
   * and as a callback function for uncontrolled fields. The value update of
   * uncontrolled fields is handled by the Form. Controlled fields dispatch
   * "onChange" handler at the beginning of this method. There is no need to
   * dispatch the handler method once more.
   */
  if (!isControlled && customChangeHandler) {
    dispatch(
      customChangeHandler,
      {
        event,
        nextValue,
        prevValue,
        fieldProps: nextFieldProps,
        fields: form.state.fields,
        form,
      },
      form.context,
    )
  }

  return { nextFieldProps, nextFields }
}
