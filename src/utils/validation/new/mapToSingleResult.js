export default function mapToSingleResult(name, funcs) {
  return (...args) => {
    console.groupCollapsed('mapToSingleResult', name)
    console.log({ funcs })
    const funcsArr = Array.isArray(funcs) ? funcs : [funcs]

    const res = funcsArr.reduce(
      (acc, func) => {
        console.log('calling func', func)
        const funcRes = func(...args)

        console.log(`funcRes for ${name}:`, funcRes)

        acc.expected = acc.expected ? funcRes.expected : acc.expected

        // TODO

        return acc
      },
      {
        expected: true,
        rejectedRules: undefined,
      },
    )

    console.warn('reduced:', res)

    return res
  }
}
