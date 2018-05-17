export default function createMessageResolverArgs(params, extra) {
  return {
    ...extra,
    ...params,
  }
}
