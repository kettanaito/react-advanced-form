//
// TODO
// Is this really needed? Consider removing.
//
export default function createMessageResolverArgs(params, extra) {
  return {
    ...extra,
    ...params,
  }
}
