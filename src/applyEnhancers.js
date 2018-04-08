/**
 * Applies the provided enhancers to the field.
 * @param {Enhancer[]} enhancers
 */
import invariant from 'invariant';
import React from 'react';
import PropTypes from 'prop-types';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { getComponentName } from './utils';

export default function applyEnhancers(...enhancers) {
  return (Field) => {
    const fieldComponentName = getComponentName(Field);

    invariant(enhancers && (enhancers.length > 0), 'Cannot apply enhancers to the `%s` field. Expected the list ' +
      'of enhancers separated by comma, but got none.', fieldComponentName);

    class EnhancedField extends React.Component {
      static displayName = `Enhanced(${fieldComponentName})`;

      static childContextTypes = {
        enhancers: PropTypes.array
      }

      getChildContext() {
        return {
          enhancers: enhancers.map(Enhancer => new Enhancer(this.props))
        };
      }

      render() {
        return (
          <Field { ...this.props } />
        );
      }
    }

    return hoistNonReactStatics(EnhancedField, Field);
  };
}
