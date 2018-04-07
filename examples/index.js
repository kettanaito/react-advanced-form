import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import 'bootstrap/dist/css/bootstrap.min.css';

function logSerialized({ serialized }) {
  return action('serialized')(serialized);
}

function addComponent(Component) {
  return () => (<Component.type { ...Component.props } onSubmitStart={ logSerialized } />);
}

/* Basics */
import UncontrolledFields from './basics/UncontrolledFields';
import ControlledFields from './basics/ControlledFields';

/* Field grouping */
import SimpleGroup from './field-grouping/SimpleGroup';
import NestedGroups from './field-grouping/NestedGroups';
import SplitGroups from './field-grouping/SplitGroups';

/* Validation */
import FieldPropsRule from './validation/SyncValidation/Field.props.rule';
import FormPropsRules from './validation/SyncValidation/Form.props.rules';
import FieldPropsAsyncRule from './validation/AsyncValidation/Field.props.asyncRule';

/* Reactive props */
import RxPropsDynamicRequired from './reactive-props/DynamicRequired';
import RxPropsSingleTarget from './reactive-props/SingleTarget';
import RxPropsInterdependent from './reactive-props/Interdependent';
import RxPropsDelegatedSubscription from './reactive-props/DelegatedSubscription';

/* Full examples */
import RegistrationForm from './full/RegistrationForm';

/* Third-party fields integration */
import ReactSelect from './third-party/react-select';
import ReactSlider from './third-party/react-slider';
import ReactDatepicker from './third-party/react-datepicker';
import ReactGoogleMaps from './third-party/react-google-maps';

storiesOf('Integration tests|Basics', module)
  .add('Uncontrolled fields', addComponent(<UncontrolledFields />))
  .add('Controlled fields', addComponent(<ControlledFields />))

storiesOf('Integration tests|Synchronous validation', module)
  .add('Field.props.rule', addComponent(<FieldPropsRule />))
  .add('Form.props.rules', addComponent(<FormPropsRules />))

storiesOf('Integration tests|Asynchronous validation', module)
  .add('Field.props.asyncRule', addComponent(<FieldPropsAsyncRule />))

storiesOf('Advanced|Field grouping', module)
  .add('Simple group', addComponent(<SimpleGroup />))
  .add('Nested groups', addComponent(<NestedGroups />))
  .add('Split groups', addComponent(<SplitGroups />))

storiesOf('Advanced|Reactive props', module)
  .add('Dynamic require', addComponent(<RxPropsDynamicRequired />))
  .add('Single field target', addComponent(<RxPropsSingleTarget />))
  .add('Interdependent fields', addComponent(<RxPropsInterdependent />))
  .add('Delegated subscription', addComponent(<RxPropsDelegatedSubscription />))

storiesOf('Other|Third-party fields', module)
  .add('react-select', addComponent(<ReactSelect />))
  .add('react-rangeslider', addComponent(<ReactSlider />))
  .add('react-datepicker', addComponent(<ReactDatepicker />))
  .add('react-google-maps', addComponent(<ReactGoogleMaps />))

storiesOf('Other|Full examples', module)
  .add('Registration Form', addComponent(<RegistrationForm />))
