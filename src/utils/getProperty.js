/**
 * Gets the provided property name from the primary Object.
 * In case the property is not set in the primary Object, attempts to get it from
 * the fallback Object.
 * @param {string} propertyName
 * @param {Object} primaryObj
 * @param {Object} fallbackObj
 * @return {mixed}
 */
import { isset } from '../utils';

export default function getProperty(propertyName, primaryObj, fallbackObj) {
  const primaryValue = primaryObj[propertyName];
  return isset(primaryValue) ? primaryValue : fallbackObj[propertyName];
}
