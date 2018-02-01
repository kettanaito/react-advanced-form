export default function defer(func, timeout = 25) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const payload = func();
        resolve(payload);
      } catch(error) {
        reject(error);
      }
    }, timeout);
  });
}
