export default function isset(variable) {
  return (typeof variable !== 'undefined') && (variable !== null);
}
