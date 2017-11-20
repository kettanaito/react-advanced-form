export serialize from './serialize';

export function isset(variable) {
  return (typeof variable !== 'undefined') && (variable !== null);
}
