export default function defer(func) {
  return new Promise(resolve => setTimeout(() => resolve(func()), 25));
}
