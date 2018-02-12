import React from 'react';

import { storiesOf } from '@storybook/react';

import ValidationExample from './ValidationExample';
import ReactiveProps from './ReactiveProps';
import ControlledForm from './ControlledForm';
import Messages from './Messages';

storiesOf('Form', module)
  .add('Messages', () => (<Messages />))
  .add('Validation example', () => (<ValidationExample />))
  .add('Reactive props', () => <ReactiveProps />)
  .add('Controlled form', () => <ControlledForm />)
