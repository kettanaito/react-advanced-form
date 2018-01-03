import React from 'react';
import createField from '../createField';

class Select extends React.Component {
  /**
   * Field registration.
   * This is a Field's lifecycle method called immediately before its registration in the Form.
   * The Object this method returns is treated as field props to be registered in the Form.
   */
  fieldWillRegister() {
    console.warn('SELECT CALLS FIELD WILL REGISTER!');
    
    const { children, initialValue } = this.props;
    const firstChildValue = children && children[0].value;

    return {
      ...this.props,
      initialValue: initialValue || firstChildValue
    };
  }

  render() {
    return (
      <select {...this.props}>
        { this.props.children }
      </select>
    );
  }
}

export default createField()(Select);

// export default class Select extends Field {
//   static displayName = 'Field.Select'

//   static propTypes = {
//     id: PropTypes.string,
//     className: PropTypes.string,
//     value: PropTypes.string
//   }

//   /**
//    * Field registration.
//    * This is a Field's lifecycle method called immediately before its registration in the Form.
//    * The Object this method returns is treated as field props to be registered in the Form.
//    */
//   fieldWillRegister() {
//     const { children, initialValue } = this.props;
//     const firstChildValue = children && children[0].value;

//     return {
//       ...this.props,
//       initialValue: initialValue || firstChildValue
//     };
//   }

//   renderElement(props) {
//     return (
//       <select>
//         { props.children }
//       </select>
//     );
//   }
// }
