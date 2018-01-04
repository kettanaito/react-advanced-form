import React from 'react';
import createField from '../createField';

class Textarea extends React.Component {
  render() {
    return (<textarea { ...this.props } />);
  }
}

export default createField()(Textarea);
