import React from 'react';

import { storiesOf } from '@storybook/react';

import FullForm from './FullForm';
import DefaultForm from './DefaultForm';
import Rfq from './Rfq';
import ControlledForm from './ControlledForm';
import Conditional from './Conditional';
import BugWithForm from './BugWithForm';
import InvalidFields from './InvalidFields';

storiesOf('Form', module)
  .add('Full form', () => (<FullForm />))
  .add('Default form', () => (<DefaultForm />))
  .add('Dynamic "required"', () => <Rfq />)
  .add('Controlled form', () => <ControlledForm />)
  .add('Conditional fields', () => <Conditional />)
  .add('BugWithForm', () => <BugWithForm />)
  .add('Invalid fields', () => <InvalidFields />);
