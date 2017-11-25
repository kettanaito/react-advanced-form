import React from 'react';

import { storiesOf } from '@storybook/react';

import DefaultForm from './DefaultForm';
import RfqForm from './RfqForm';

storiesOf('Form', module)
  .add('Default form', () => (<DefaultForm />))
  .add('RFQ form', () => <RfqForm />);
