import React from 'react';
import { FormProvider } from '@lib';
import rules from './validation-rules';
import messages from './validation-messages';
import RegistrationForm from './RegistrationForm';

export default class App extends React.Component {
  render() {
    return (
      <FormProvider rules={ rules } messages={ messages }>
        <RegistrationForm />
      </FormProvider>
    );
  }
}
