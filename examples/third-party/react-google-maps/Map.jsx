import React from 'react';
import { compose, withProps } from 'recompose';
import { createField } from '@lib';
import { withScriptjs, withGoogleMap, GoogleMap } from 'react-google-maps';

class Map extends React.Component {
  render() {
    const { fieldProps } = this.props;

    return (
      <GoogleMap
        {...fieldProps} />
    );
  }
}

const WrappedMap = compose(
  withProps({
    googleMapURL: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAyu6oNF0UI7m_hXzetQvEVg6RJWyRqGE4&v=3&libraries=geometry,drawing,places',
    loadingElement: (<p>Loading</p>),
    containerElement: <div style={{ height: '400px', width: '500px' }} />,
    mapElement: <div style={{ height: '100%' }} />,
  }),
  withScriptjs,
  withGoogleMap
)(Map);

export default createField()(WrappedMap);
