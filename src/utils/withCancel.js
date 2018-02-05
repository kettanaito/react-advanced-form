/**
 * Wraps the Promise into another Promise to allow to cancel the original.
 * @param {Promise} promise
 */
export default function withCancel(promise) {
  let isCanceled = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise
      .then(payload => isCanceled ? reject({ isCanceled: true }) : resolve(payload))
      .catch(error => isCanceled ? reject({ isCanceled: true }) : reject(error));
  });

  return {
    itself: wrappedPromise,
    cancel() {
      isCanceled = true;
    }
  };
}
