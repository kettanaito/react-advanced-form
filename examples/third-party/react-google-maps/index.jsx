import React from 'react';
import { Form } from '@lib';
import Map from './Map';

export default class ReactGoogleMapsExample extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1>google-maps</h1>

        <Form>
          <Map
            name="location" />
        </Form>
      </React.Fragment>
    )
  }
}