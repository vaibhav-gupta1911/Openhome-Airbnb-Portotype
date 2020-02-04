import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import React, { Component } from 'react';



const mapStyles = {
  width: '100%',
  height: '100%',
  align: "center",
  marginVertical: 10,
  marginHorizontal: 20
}

export class SimpleMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  }

  displayMarkers = () => {
    return this.props.stores.map((store, index) => {
      return <Marker key={index}
        id={index}
        title={store.name}
        position={{
          lat: store.latitude,
          lng: store.longitude,
        }}
        onClick={() => console.log("You clicked me!")} />
    })
  }

  componentDidMount() {
    this.displayMarkers();
  }


  render() {

    return (
      <div style={{ position: 'relative', width: '50vw', height: '60vh', margin: '25px' }}>

        <Map
          google={this.props.google}
          zoom={10}
          style={mapStyles}
          center={this.props.mapcenter}
        >
          {this.displayMarkers()}
        </Map>
      </div>

    );
  }
}

export default GoogleApiWrapper
  ({
    apiKey: ("AIzaSyCw1Cu5QmZqsFLWq-D7m12E3Qqjjj13xWY")
  })(SimpleMap)
