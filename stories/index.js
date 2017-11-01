import React from 'react';

import { storiesOf } from '@storybook/react';

import DefaultForm from './DefaultForm';

storiesOf('Form', module)
  .add('Default form', () => <DefaultForm />);
