/**
 * Input.
 */
import React from 'react';
import PropTypes from 'prop-types';
import createField from '../createField';

class Input extends React.Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }

  static defaultProps = {
    type: 'text'
  }

  render() {
    return (<input {...this.props} />);
  }
}

export default createField()(Input);
