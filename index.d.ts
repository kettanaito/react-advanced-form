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

export interface ValidationRuleGroup {
  [key: string]: Rule
}

export interface ValidationSchema {
  type?: {
    [key: string]: Rule
  }
  name?: {
    [key: string]: Rule | ValidationRuleGroup
  }
}

export interface ValidationMessageSet {
  [key: string]: {
    invalid?: string
    required?: string
    rule?: {
      [key: string]: string
    }
  }
}

export interface ValidationMessageGroup {
  [key: string]: ValidationMessageSet
}

export interface ValidationMessages {
  type?: ValidationMessageSet
  name?: ValidationMessageSet | ValidationMessageGroup
  general?: ValidationMessageSet
}

type GenericFormEvent = (args: { fields: Fields; form: Form }) => void

type FormSubmitState = {
  serialized: SerializedForm
  fields: Fields
  form: Form
}

type SubmitFormEvent = (args: FormSubmitState) => void

export interface FormProps {
  id?: string
  className?: string
  style?: React.CSSProperties
  innerRef?: () => void
  action: (args: FormSubmitState) => Promise<void>
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
      fieldProps: React.InputHTMLAttributes<HTMLInputElement>
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
  value: string
  fieldProps: React.InputHTMLAttributes<HTMLInputElement>
  fields: Fields
  form: Form
}

export type AsyncRulePayload = {
  valid: boolean
  extra?: {
    [exraKey: string]: any // ?
  }
}

interface Event {
  event: React.FormEvent<HTMLInputElement>
  fieldProps: React.InputHTMLAttributes<HTMLInputElement>
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

export type Rule = RegExp | ((args: RuleParameters) => boolean)
export type AsyncRule = RegExp | ((args: RuleParameters) => AsyncRulePayload)

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

export interface CreateFieldState {
  asyncRule?: AsyncRule
  controlled: boolean
  debounceValidate: () => any // ?
  errors: string[] | null
  expected: boolean
  fieldGroup?: string // ?
  fieldPath: string[]
  focused: boolean
  getRef: any // ?
  initialValue: string
  invalid: boolean
  mapValue: () => any // ?
  onBlur?: BlurFunction
  onChange?: ChangeFunction
  onFocus?: FocusFunction
  pendingAsyncValidation?: boolean // ?
  reactiveProps: any // ?
  required: boolean
  rule?: Rule
  serialize: () => string
  skip?: boolean
  type: string
  valid: boolean
  validAsync: boolean
  validatedAsync: boolean
  validatedSync: boolean
  validating: boolean
  validSync: boolean
  value: string | number
  valuePropName: string
}

export interface CreateFieldProps {
  fieldProps: React.InputHTMLAttributes<HTMLInputElement>
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
