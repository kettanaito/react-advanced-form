import PropTypes from 'prop-types';
import { IterableInstance } from './utils';

export default function Condition(props, context) {
  const { fields } = context;
  const { children, when } = props;

  /* Resolve the condition in order to render the children */
  const resolved = when({ fields: fields.toJS() });

  return resolved ? children : null;
}

Condition.propTypes = {
  when: PropTypes.func.isRequired
};

Condition.contextTypes = {
  fields: IterableInstance
};
