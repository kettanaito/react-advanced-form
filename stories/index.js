import React from 'react';

import { storiesOf } from '@storybook/react';

import DefaultForm from './DefaultForm';
import Rfq from './Rfq';
import Conditional from './Conditional';

storiesOf('Form', module)
  .add('Default form', () => (<DefaultForm />))
  .add('Dynamic "required"', () => <Rfq />)
  .add('Conditional fields', () => <Conditional />);
