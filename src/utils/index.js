export * as fieldUtils from './fieldUtils';
export IterableInstance from './IterableInstance';

export function isset(variable) {
  return (typeof variable !== 'undefined') && (variable !== null);
}
