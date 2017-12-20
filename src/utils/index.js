export debounce from './debounce';
export IterableInstance from './IterableInstance';
export getProperty from './getProperty';
export getPropsPatch from './getPropsPatch';
export * as fieldUtils from './fieldUtils';

export function isset(variable) {
  return (typeof variable !== 'undefined') && (variable !== null);
}
