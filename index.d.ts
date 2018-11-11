import * as React from 'react'

export interface FormProviderProps {
  rules?: ValidationSchema
  messages?: ValidationMessages
  debounceTime?: number
}

export class FormProvider extends React.Component<FormProviderProps> {}

/**
 * Field.Group
 */
export interface FieldGroupProps {
  name: string
  exact?: boolean
}

export interface Field {
  Group: React.ComponentClass<FieldGroupProps>
}

export interface InitialValues {
  [key: string]: string | InitialValues
}

export interface SerializedFields {
  [key: string]: string | SerializedFields
}

export interface FormErrors {
  [key: string]: string | string[] | FormErrors
}

export interface Fields {
  [fieldPath: string]: FieldState<string> | Fields
}

/**
 * Validation schema
 */
export interface RuleResolverArgs {
  /**
   * Reactive field prop getter.
   * Subscribes to the given field's prop path and resolves
   * each time the prop value has changed.
   */
  get: (fieldPropPath: string[]) => any
  value: string
  fieldProps: FieldState<string>
  fields: Fields
  form: Form
}

export type RuleResolver = (args: RuleResolverArgs) => boolean

export type AsyncRulePayload = {
  /**
   * Determines whether a field is valid based on the
   * asynchronous validation result.
   */
  valid: boolean
  /**
   * Map of extra parameters returned from the asynchronous validation.
   * Accessible under validation messages resolvers.
   */
  extra?: {
    [exraKey: string]: any
  }
}

export interface RuleResolverGroup {
  [ruleName: string]: RuleResolver
}

export interface ValidationSchema {
  type?: {
    [rulePath: string]: RuleResolver | RuleResolverGroup
  }
  name?: {
    [rulePath: string]: RuleResolver | RuleResolverGroup
  }
}

/**
 * Validation messages
 */
export interface MessageResolverArgs {
  extra?: Object
  fieldProps: FieldState<string>
  fields: Fields
  form: Form
}

export type MessageResolver = string | ((args: MessageResolverArgs) => string)

export interface ValidationMessagesTypes {
  [key: string]: {
    invalid?: MessageResolver
    missing?: MessageResolver
    rule?: {
      [ruleName: string]: MessageResolver
    }
  }
}

export interface ValidationMessagesGroup {
  [messagePath: string]: ValidationMessagesTypes
}

export interface ValidationMessages {
  general?: ValidationMessagesTypes
  type?: ValidationMessagesTypes
  name?: ValidationMessagesTypes | ValidationMessagesGroup
}

export type Errors = string[] | string | null

export interface FieldErrors {
  [key: string]:
    | Errors
    | {
        [key: string]: Errors
      }
}

type FormGenericPayload = (args: { fields: Fields; form: Form }) => void

type FormSubmitPayload = {
  serialized: SerializedFields
  fields: Fields
  form: Form
}

type SubmitFormEvent = (args: FormSubmitPayload) => void

export interface FormProps {
  id?: string
  className?: string
  style?: React.CSSProperties
  innerRef?: (ref: Form) => void
  action: (args: FormSubmitPayload) => Promise<void> /** @todo */
  initialValues?: InitialValues

  /* Validation */
  rules?: ValidationSchema
  messages?: ValidationMessages

  /* Callbacks */
  onFirstChange?(args: {
    event: React.FormEvent
    nextValue: any /** @todo Field value generics */
    prevValue: any
    fieldProps: FieldState<string> /** @todo */
    fields: Fields
    form: Form
  }): void
  onClear?: FormGenericPayload
  onReset?: FormGenericPayload
  onSerialize?(
    args: FormGenericPayload & { serialized: SerializedFields },
  ): void
  onInvalid?(
    args: FormGenericPayload & {
      invalidFields: Fields
      fields: Fields
      form: Form
    },
  ): void
  onSubmitStart?: SubmitFormEvent
  onSubmitted?: SubmitFormEvent
  onSubmitFailed?: SubmitFormEvent
  onSubmitEnd?: SubmitFormEvent
}

export interface FormState {
  fields: Fields
  applicableRules: Object /** @todo */
  dirty: boolean
}

export class Form extends React.Component<FormProps, FormState> {
  /* Private */
  private withRegisteredField
  private registerField
  private updateFieldsWith
  private unregisterField
  private handleFieldFocus
  private handleFieldChange
  private handleFieldBlur
  private validateField

  /* Public */
  clear(predicate?: (fieldState: Field) => boolean): void
  reset(predicate?: (fieldState: Field) => boolean): void
  validate(predicate?: (fieldState: Field) => boolean): Promise<boolean>
  serialize(): SerializedFields
  setValues(fieldsPatch: SerializedFields): void
  setErrors(errors: FieldErrors): void
  submit(): Promise<void> /** @todo */
}

interface FormGenericEvent {
  event: React.FormEvent<HTMLInputElement>
  fieldProps: FieldState<string>
  fields: Fields
  form: Form
}

export interface BlurEvent extends FormGenericEvent {}
export interface FocusEvent extends FormGenericEvent {}

export interface ChangeEvent extends FormGenericEvent {
  event: React.FormEvent<HTMLInputElement>
  prevValue: string
  nextValue: string
}

export type Rule = RegExp | ((args: RuleResolverArgs) => boolean)
export type AsyncRule = RegExp | ((args: RuleResolverArgs) => AsyncRulePayload)

export type BlurHandler = (args: BlurEvent) => void
export type ChangeHandler = (args: ChangeEvent) => void
export type FocusHandler = (args: FocusEvent) => void

/**
 * Map derived from the field's state, that is being assigned to the
 * field element (i.e. input, select, etc.).
 */
export interface FieldProps {
  rule?: Rule /** @todo shouldn't be here */
  asyncRule?: AsyncRule /** @todo shouldn't be here */
  required?: boolean
  skip?: boolean /** @todo shouldn't be here */
  onBlur?: BlurHandler
  onChange?: ChangeHandler
  onFocus?: FocusHandler
}

/** @todo Value generic */
export interface FieldState<V> {
  /**
   * Asynchronous field rule resolver.
   */
  asyncRule?: AsyncRule
  controlled: boolean
  debounceValidate: () => any /** @todo */
  /**
   * List of the applicable error messages.
   */
  errors: string[] | null
  /**
   * Determines whether the current value of this field
   * is expected by the relevant validation rules.
   */
  expected: boolean
  fieldGroup?: string /** @todo */
  fieldPath: string[]
  focused: boolean
  getRef: () => any /** @todo */
  initialValue: string
  invalid: boolean
  mapValue: (value: V) => any
  onBlur?: BlurHandler
  onChange?: ChangeHandler
  onFocus?: FocusHandler
  pendingAsyncValidation?: boolean /** @todo */
  reactiveProps: any /** @todo */
  required: boolean
  /**
   * Synchornous field rule resolver.
   */
  rule?: Rule
  serialize: (value: V) => string
  /**
   * Determines whether to skip this field during the fields serialization
   * regardless of its validity or value.
   */
  skip?: boolean
  touched: boolean
  type: string
  valid: boolean
  validAsync: boolean
  validatedAsync: boolean
  validatedSync: boolean
  validating: boolean
  validSync: boolean
  value: V
  valuePropName: string
}

export const fieldPresets: {
  checkbox: CreateFieldOptions<boolean, 'checked'>
  input: CreateFieldOptions<string>
  radio: CreateFieldOptions<string>
  select: CreateFieldOptions<string>
  textarea: CreateFieldOptions<string>
}

export interface CreateFieldOptions<V, ValuePropName = 'value'> {
  /**
   * Allows multiple instance of this field to be registered
   * with the same name within a single form context (Form, Field.Group).
   */
  allowMultiple?: boolean

  /**
   * Property name that stores the value of this field.
   */
  valuePropName?: ValuePropName

  /**
   * Initial value of all the instances of this field.
   * This has lower priority than "MyField.props.initialValue"
   */
  initialValue?: any
  beforeRegister: () => any /** @todo */

  /**
   * Determines whether a field must be validated upon mounting.
   */
  shouldValidateOnMount: (
    args: {
      valuePropName: ValuePropName /** @todo [valuePropName] dynamic property */
      fieldRecord: any
      context: any
    },
  ) => boolean
  mapPropsToField: () => Object /** @todo */
  enforceProps: () => Object /** @todo */

  /**
   * A predicate function that determines whether a field contains any value.
   * Useful for the fields with the custom value instance (i.e. Object).
   */
  assertValue: (value: V) => boolean

  /**
   * Custom mapping function applied whenever a field receives a "raw" value.
   * Useful when the internal value instance of a field has a different data type
   * than its initial value. This has no effect over the internal value updates.
   */
  mapValue: (value: any) => any

  /**
   * Custom transformer function applied to the serialized field's value.
   */
  serialize: (value: V) => any
}

export function createField<P>(
  options: CreateFieldOptions<string>,
): (
  component: (
    props: P & {
      fieldProps: React.InputHTMLAttributes<HTMLInputElement>
      fieldState: FieldState<string>
    },
  ) => React.ReactElement<P & FieldProps>,
) => React.ComponentClass<P & FieldProps>
