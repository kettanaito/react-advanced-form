import React from 'react';
import { mount } from 'cypress-react-unit-test';

describe('Synchronous validation', function () {
  require('./Form.props.rules.spec');
  require('./Field.props.rule.spec');
});
