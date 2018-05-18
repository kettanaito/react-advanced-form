import { expect } from 'chai'
import createRejectedRule from './createRejectedRule'

test('Propagates given properties properly', () => {
  const rejectedRule = createRejectedRule({
    selector: 'name',
    errorType: 'async',
  })

  // TODO Finish the test
})
