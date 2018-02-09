import React from 'react';

import { storiesOf } from '@storybook/react';

import ValidationExample from './ValidationExample';
import NativeFields from './NativeFields';
import Rfq from './Rfq';
import ControlledForm from './ControlledForm';
import Conditional from './Conditional';
import BugWithForm from './BugWithForm';
import InvalidFields from './InvalidFields';
import Messages from './Messages';

storiesOf('Form', module)
  .add('Messages', () => (<Messages />))
  .add('ValidationExample', () => (<ValidationExample />))
  .add('Native fields', () => (<NativeFields />))
  .add('Dynamic "required"', () => <Rfq />)
  .add('Controlled form', () => <ControlledForm />)
  .add('Conditional fields', () => <Conditional />)
  .add('BugWithForm', () => <BugWithForm />)
  .add('Invalid fields', () => <InvalidFields />);
