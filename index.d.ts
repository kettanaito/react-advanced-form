import * as React from 'react'

export interface FormProviderProps {
  rules?: ValidationSchema
  messages?: ValidationMessages
  debounceTime?: number
}

export class FormProvider extends React.Component<FormProviderProps> {}

export interface Field {
  Group: React.ComponentClass<{ name: string }>
}

export interface InitialValues {
  [key: string]: string | InitialValues
}

export interface SerializedForm {
  [key: string]: string | SerializedForm
}

export interface FormErrors {
  [key: string]: string | string[] | FormErrors
}

export interface Fields {
  [key: string]: Field | Fields
}

export interface ValidationSchema {}

export interface ValidationMessages {
  [key: string]: string | string[] | ValidationMessages
}

type GenericFormEvent = (args: { fields: Fields; form: Form }) => void
type SubmitFormEvent = (
  args: { serialized: SerializedForm; fields: Fields; form: Form },
) => void

export interface FormProps {
  innerRef?: () => void
  action: () => void | Promise<void>
  initialValues?: InitialValues

  /* Validation */
  rules?: ValidationSchema
  messages?: ValidationMessages

  /* Callbacks */
  onFirstChange?: (
    args: {
      event: React.FormEvent
      nextValue: string
      prevValue: string
      fieldProps: object
      fields: Fields
      form: Form
    },
  ) => void
  onClear?: GenericFormEvent
  onReset?: GenericFormEvent
  onSerialize?: (args: { serialized: SerializedForm }) => void
  onInvalid?: (
    args: { invalidFields: Fields; fields: Fields; form: Form },
  ) => void
  onSubmitStart?: SubmitFormEvent
  onSubmitted?: SubmitFormEvent
  onSubmitFailed?: SubmitFormEvent
  onSubmitEnd?: SubmitFormEvent
}

export class Form extends React.Component<FormProps> {
  reset: () => void
  serialize: () => SerializedForm
  setErrors: FormErrors
  submit: () => Promise<void>
  validate: () => Promise<void>
}

export interface RuleParameters {
  get: (path: string[]) => string | undefined
  value: any
  fieldProps: any
  fields: Fields
  form: Form
}

export type AsyncRulePayload = {
  valid: boolean
  extra?: {
    [exraKey: string]: any
  }
}

interface Event {
  event: React.FormEvent<HTMLInputElement>
  fieldProps: any
  fields: Fields
  form: Form
}

export interface BlurEvent extends Event {}
export interface FocusEvent extends Event {}

export interface ChangeEvent extends Event {
  event: React.FormEvent<HTMLInputElement>
  prevValue: any
  nextValue: any
}

export interface FieldProps {
  rule?: RegExp | ((args: RuleParameters) => boolean)
  asyncRule?: RegExp | ((args: RuleParameters) => AsyncRulePayload)
  required?: boolean
  skip?: boolean
  onBlur?: (args: BlurEvent) => void
  onChange?: (args: ChangeEvent) => void
  onFocus?: (args: FocusEvent) => void
}

export interface CreateFieldState {
  required: boolean
  validating: boolean
  validatedSync: boolean
  validatedAsync: boolean
  valid: boolean
  validSync: boolean
  validAsync: boolean
  invalid: boolean
  errors?: string[]
}

export interface CreateFieldProps {
  fieldProps: any
  fieldState: CreateFieldState
}

type FieldPreset =
  | React.InputHTMLAttributes<HTMLInputElement>
  | React.InputHTMLAttributes<HTMLSelectElement>
  | React.TextareaHTMLAttributes<HTMLTextAreaElement>

export const fieldPresets: {
  checkbox: React.InputHTMLAttributes<HTMLInputElement>
  input: React.InputHTMLAttributes<HTMLInputElement>
  radio: React.InputHTMLAttributes<HTMLInputElement>
  select: React.InputHTMLAttributes<HTMLSelectElement>
  textarea: React.TextareaHTMLAttributes<HTMLTextAreaElement>
}

export function createField<P>(
  preset: FieldPreset,
): (
  component: (
    props: CreateFieldProps & P,
  ) => React.ReactElement<FieldProps & P>,
) => React.ComponentClass<FieldProps & P>
