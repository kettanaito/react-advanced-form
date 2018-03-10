import ensafeMap from './ensafeMap';

/**
 * Recursively proxies the given origin. Calls optional "callback" function whenever any property
 * if the origin is being referenced.
 * @param {Object} origin
 * @param {Function} callback
 * @returns {Proxy}
 */
function proxyWithCallback(origin, callback) {
  return new Proxy(origin, {
    get(target, propName) {
      if (callback) callback({ target, propName });
      return proxyWithCallback({}, callback);
    }
  });
}

/**
 * Returns the collection of field paths of the fields referenced within the provided method.
 * @param {Function} method
 * @param {Object} fields
 */
export default function flushFieldRefs(method, { fields, ...restParams }) {
  const refs = [];
  const mutableFields = fields.toJS();

  /* Assign a temporary property to state the root level of target Object */
  mutableFields.__IS_ROOT__ = true;

  const fieldsProxy = proxyWithCallback(mutableFields, ({ target, propName }) => {
    if (target.__IS_ROOT__) {
      refs.push([]);
    }

    const refEntry = refs[refs.length - 1];
    refEntry.push(propName);
  });

  /* First, execute the method with proxied fields to gather the field path refs */
  method({ ...restParams, fields: fieldsProxy });

  /* Second, execute the method with missing path refs set to "undefined" to prevent throwing */
  const safeFields = ensafeMap(fields, refs);
  const initialValue = method({ ...restParams, fields: safeFields.toJS() });

  return { refs, initialValue };
}
