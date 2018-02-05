/**
 * Wraps the Promise into another Promise to allow to cancel the original.
 * @param {Promise} promise
 */
export default function makeCancelable(promise) {
  let isCanceled = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise
      .then(payload => isCanceled || resolve(payload))
      .catch(error => isCanceled || reject(error));
  });

  return {
    itself: wrappedPromise,
    cancel() {
      isCanceled = true;
    }
  };
}
