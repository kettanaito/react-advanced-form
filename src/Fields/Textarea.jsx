/**
 * Textarea.
 */
import React from 'react';
import Field from './Field';

export default class Textarea extends Field {
  static displayName = 'Field.Textarea'

  renderElement() {
    return (<textarea />);
  }
}
