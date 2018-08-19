// @flow
/**
 * Wraps the Promise into another Promise to allow to cancel the original.
 * @param {Promise} promise
 */
export interface ICancelablePromise<R> {
  itself: Promise<R>;
  cancel: () => void;
}

export default function makeCancelable<R>(
  promise: Promise<R>,
): ICancelablePromise<R> {
  let isCanceled = false

  const wrappedPromise: Promise<R> = new Promise((resolve, reject) => {
    promise
      .then((payload) => isCanceled || resolve(payload))
      .catch((error: Error) => isCanceled || reject(error))
  })

  return {
    itself: wrappedPromise,
    cancel: () => {
      isCanceled = true
    },
  }
}
