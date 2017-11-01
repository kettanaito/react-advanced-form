// import { TFormProps } from './Form';
// import { TFieldProps, TFieldValue } from './Field';

// export interface TValidationRules {
//   type?: { [fieldType: string]: TRule },
//   name?: { [fieldName: string]: TRule }
// }

// /**
//  * Validation rule definition.
//  */
// export interface TRule {
//   (
//     value: TFieldValue,
//     fieldProps: TFieldProps,
//     formProps: TFormProps
//   ): boolean
// }

// /**
//  * Asynchronous rule definition.
//  */
// export interface TAsyncRule {
//   (
//     uri: string,
//     payload: TAsyncRulePayload,
//     success?: TAsyncRuleSuccessHandler,
//     error?: TAsyncRuleErrorHandler
//   ): void
// }

// export interface TAsyncRulePayload {
//   (
//     value: TFieldValue,
//     fieldProps: TFieldProps,
//     formProps: TFormProps
//   ): Object
// }

// export interface TAsyncRuleSuccessHandler {
//   (response: Object): boolean
// }

// export interface TAsyncRuleErrorHandler {
//   (response: Object): Object
// }
