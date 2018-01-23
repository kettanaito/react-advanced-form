import React from 'react';

import { storiesOf } from '@storybook/react';

import NativeFields from './NativeFields';
import StyledFields from './StyledFields';
import Rfq from './Rfq';
import ControlledForm from './ControlledForm';
import Conditional from './Conditional';
import BugWithForm from './BugWithForm';
import InvalidFields from './InvalidFields';

storiesOf('Form', module)
  .add('Native fields', () => (<NativeFields />))
  .add('Styled fields', () => (<StyledFields />))
  .add('Dynamic "required"', () => <Rfq />)
  .add('Controlled form', () => <ControlledForm />)
  .add('Conditional fields', () => <Conditional />)
  .add('BugWithForm', () => <BugWithForm />)
  .add('Invalid fields', () => <InvalidFields />);
