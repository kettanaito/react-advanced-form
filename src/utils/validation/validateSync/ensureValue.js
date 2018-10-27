import * as R from 'ramda'
import * as recordUtils from '../../recordUtils'
import errorTypes from '../errorTypes'
import applyRule from '../applyRule'

const ensureValue = R.always(
  applyRule({
    /**
     * Always set the selector for the missing error type to "name",
     * since in case any "message.name.missing" is present, it should
     * be taken as a priority.
     */
    selector: 'name',
    errorType: errorTypes.missing,
    resolver: ({ fieldProps }) => !!recordUtils.getValue(fieldProps),
  }),
)

export default ensureValue
