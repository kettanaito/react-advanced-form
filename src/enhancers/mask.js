import PropTypes from 'prop-types';
import Enhancer from '../classes/Enhancer';

export default class Mask extends Enhancer {
  extendPropTypes() {
    return {
      mask: PropTypes.string
    };
  }

  enhancerDidApply() {
    this.addInterceptor('fieldChange', this.handleFieldChange);
  }

  handleFieldChange({ nextValue }) {
    console.warn('The field is changing the value to', nextValue);
  }
}
