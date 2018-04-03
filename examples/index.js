import React from 'react';
import { storiesOf } from '@storybook/react';
import 'bootstrap/dist/css/bootstrap.min.css';

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
import RxPropsBasic from './reactive-props/Basic';
import RxPropsSingleTarget from './reactive-props/SingleTarget';
import RxPropsInterdependent from './reactive-props/Interdependent';
import RxPropsDelegated from './reactive-props/Delegated';

/* Full examples */
import RegistrationForm from './full/RegistrationForm';

/* Third-party fields integration */
import ReactSelect from './third-party/react-select';
import ReactSlider from './third-party/react-slider';

storiesOf('Basics', module)
  .add('Uncontrolled fields', () => <UncontrolledFields />)
  .add('Controlled fields', () => <ControlledFields />)

storiesOf('Field grouping', module)
  .add('Simple group', () => <SimpleGroup />)
  .add('Nested groups', () => <NestedGroups />)
  .add('Split groups', () => <SplitGroups />)

storiesOf('Synchronous validation', module)
  .add('Field.props.rule', () => <FieldPropsRule />)
  .add('Form.props.rules', () => <FormPropsRules />)

storiesOf('Asynchronous validation', module)
  .add('Field.props.asyncRule', () => <FieldPropsAsyncRule />)

storiesOf('Reactive props', module)
  .add('Basic', () => <RxPropsBasic />)
  .add('Single field target', () => <RxPropsSingleTarget />)
  .add('Interdependent fields', () => <RxPropsInterdependent />)
  .add('Delegated subscription', () => <RxPropsDelegated />)

storiesOf('Full examples', module)
  .add('Registration Form', () => <RegistrationForm />)

storiesOf('Third-party integrations', module)
  .add('react-select', () => <ReactSelect />)
  .add('react-rangeslider', () => <ReactSlider />)
