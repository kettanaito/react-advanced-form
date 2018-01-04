import React from 'react';
import createField from '../createField';

class Input extends React.Component {
  render() {
    return (<input { ...this.props } />);
  }
}

export default createField()(Input);
