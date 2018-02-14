import React from 'react';

import { storiesOf } from '@storybook/react';

import ValidationExample from './ValidationExample';
import ReactiveProps from './ReactiveProps';
import ControlledForm from './ControlledForm';
import Messages from './Messages';
import RxProps from './RxProps';

storiesOf('Form', module)
  .add('RxProps', () => (<RxProps />))
  .add('Messages', () => (<Messages />))
  .add('Validation example', () => (<ValidationExample />))
  .add('Reactive props', () => <ReactiveProps />)
  .add('Controlled form', () => <ControlledForm />)
