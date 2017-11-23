export serialize from './serialize';
export * as fieldUtils from './fieldUtils';

export function isset(variable) {
  return (typeof variable !== 'undefined') && (variable !== null);
}
