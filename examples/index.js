import React from 'react';
import { storiesOf } from '@storybook/react';
import 'bootstrap/dist/css/bootstrap.min.css';

import UncontrolledFields from './basics/UncontrolledFields';
import ControlledFields from './basics/ControlledFields';

import FieldPropsRule from './validation/SyncValidation/Field.props.rule';
import FormPropsRules from './validation/SyncValidation/Form.props.rules';
import FieldPropsAsyncRule from './validation/AsyncValidation/Field.props.asyncRule';

import RxPropsBasic from './reactive-props/Basic';
import RxPropsSingleTarget from './reactive-props/SingleTarget';
import RxPropsInterdependent from './reactive-props/Interdependent';
import RxPropsDelegated from './reactive-props/Delegated';

import RegistrationForm from './full/RegistrationForm';

storiesOf('Basics', module)
  .add('Uncontrolled fields', () => <UncontrolledFields />)
  .add('Controlled fields', () => <ControlledFields />)

storiesOf('Synchronous validation', module)
  .add('Field.props.rule', () => <FieldPropsRule />)
  .add('Form.props.rules', () => <FormPropsRules />);

storiesOf('Asynchronous validation', module)
  .add('Field.props.asyncRule', () => <FieldPropsAsyncRule />);

storiesOf('Reactive props', module)
  .add('Basic', () => <RxPropsBasic />)
  .add('Single field target', () => <RxPropsSingleTarget />)
  .add('Interdependent fields', () => <RxPropsInterdependent />)
  .add('Delegated subscription', () => <RxPropsDelegated />);

storiesOf('Full examples', module)
  .add('Registration Form', () => <RegistrationForm />);
