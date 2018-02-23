import React from 'react';
import { Form } from '@lib';
import { Input } from '@components';

export const timeoutDuration = 1200;

export default class AjaxPrefilling extends React.Component {
  state = {
    isFetching: false,
    street: null
  }

  handleFetchStreet = (event) => {
    event.preventDefault();
    this.setState({ isFetching: true });
    setTimeout(() => this.setState({
      isFetching: false,
      street: 'Baker'
    }), timeoutDuration);
  }

  render() {
    const { isFetching, street } = this.state;

    return (
      <Form>
        <Input
          name="street"
          label="Street"
          value={ street }
          disabled={ isFetching }
          onChange={ ({ nextValue }) => this.setState({ street: nextValue }) }
          required />

        <Input
          name="streetRule"
          label="Street with validation"
          value={ street }
          rule={/^\d+$/}
          onChange={ ({ nextValue }) => this.setState({ street: nextValue }) }
          disabled={ isFetching }
          required />

        <button
          id="ajax"
          disabled={ isFetching }
          onClick={ this.handleFetchStreet }>
          Fetch street
        </button>

        { isFetching && (<span>Fetching...</span>) }
      </Form>
    );
  }
}
