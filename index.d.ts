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
export interface ResolverArgs {
  get: (fieldPath: string[]) => any
  value: string
  fieldProps: FieldState<string>
  fields: Fields
  form: Form
}

export type Resolver = (args: ResolverArgs) => boolean

export type AsyncRulePayload = {
  valid: boolean
  extra?: {
    [exraKey: string]: any
  }
}

export interface ResolverGroup {
  [ruleName: string]: Resolver
}

export interface ValidationSchema {
  type?: {
    [key: string]: Resolver | ResolverGroup
  }
  name?: {
    [key: string]: Resolver | ResolverGroup
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

export type MessageResolver = (args: MessageResolverArgs) => string | string

export interface ValidationMessageSet {
  [key: string]: {
    invalid?: MessageResolver
    missing?: MessageResolver
    rule?: {
      [ruleName: string]: MessageResolver
    }
  }
}

export interface ValidationMessageGroup {
  [key: string]: ValidationMessageSet
}

export interface ValidationMessages {
  general?: ValidationMessageSet
  type?: ValidationMessageSet
  name?: ValidationMessageSet | ValidationMessageGroup
}

export type Errors = string[] | string | null

export interface FieldErrors {
  [key: string]:
    | Errors
    | {
        [key: string]: Errors
      }
}

type GenericFormPayload = (args: { fields: Fields; form: Form }) => void

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
  onClear?: GenericFormPayload
  onReset?: GenericFormPayload
  onSerialize?(
    args: GenericFormPayload & { serialized: SerializedFields },
  ): void
  onInvalid?(
    args: GenericFormPayload & {
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

interface Event {
  event: React.FormEvent<HTMLInputElement>
  fieldProps: FieldState<string>
  fields: Fields
  form: Form
}

export interface BlurEvent extends Event {}
export interface FocusEvent extends Event {}

export interface ChangeEvent extends Event {
  event: React.FormEvent<HTMLInputElement>
  prevValue: string
  nextValue: string
}

export type Rule = RegExp | ((args: ResolverArgs) => boolean)
export type AsyncRule = RegExp | ((args: ResolverArgs) => AsyncRulePayload)

export type BlurFunction = (args: BlurEvent) => void
export type ChangeFunction = (args: ChangeEvent) => void
export type FocusFunction = (args: FocusEvent) => void

export interface FieldProps {
  rule?: Rule
  asyncRule?: AsyncRule
  required?: boolean
  skip?: boolean
  onBlur?: BlurFunction
  onChange?: ChangeFunction
  onFocus?: FocusFunction
}

/** @todo Value generic */
export interface FieldState<V> {
  asyncRule?: AsyncRule
  controlled: boolean
  debounceValidate: () => any /** @todo */
  errors: string[] | null
  expected: boolean
  fieldGroup?: string /** @todo */
  fieldPath: string[]
  focused: boolean
  getRef: any /** @todo */
  initialValue: string
  invalid: boolean
  mapValue: (value: V) => any
  onBlur?: BlurFunction
  onChange?: ChangeFunction
  onFocus?: FocusFunction
  pendingAsyncValidation?: boolean /** @todo */
  reactiveProps: any /** @todo */
  required: boolean
  rule?: Rule
  serialize: (value: V) => string
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
  allowMultiple?: boolean
  valuePropName?: ValuePropName
  initialValue?: any
  beforeRegister: () => any /** @todo */
  shouldValidateOnMount: (
    args: {
      valuePropName: ValuePropName /** @todo [valuePropName] dynamic property */
      fieldRecord: any
      context: any
    },
  ) => boolean
  mapPropsToField: () => any /** @todo */
  enforceProps: () => Object /** @todo */
  assertValue: (value: V) => boolean
  mapValue: (value: any) => any
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
