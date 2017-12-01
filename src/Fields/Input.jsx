/**
 * Input.
 */
import Field from './Field';

export default class Input extends Field {
  static displayName = 'Field.Input'
  static Component = 'input'

  static defaultProps = {
    type: 'text',
    expected: true,
    required: false,
    disabled: false
  }

  renderField() {
    return (<input />);
  }
}
