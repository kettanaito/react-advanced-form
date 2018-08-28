import { expect } from 'chai'
import debounce from './debounce'

test('Debounces multiple function calls within given timeout period', () => {
  let num = 0
  const increment = () => num++
  const debouncedFunc = debounce(increment, 100)

  debouncedFunc()
  setTimeout(debouncedFunc, 50)
  setTimeout(debouncedFunc, 100)

  setTimeout(() => {
    expect(num).to.equal(1)
  }, 200)
})

test('Allows multiple function calls when outside of timeout period', () => {
  let num = 0
  const increment = () => num++
  const debouncedFunc = debounce(increment, 100)

  debouncedFunc()
  setTimeout(debouncedFunc, 100)

  setTimeout(() => {
    expect(num).to.equal(2)
  }, 200)
})
