import React, { Component } from "react";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";
import './GoogleMap.scss';

export class MapContainer2 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      latNew:null,
      lngNew:null,
      lat: null,
      lng: null,
      markers: [],
      locations: []
    };
    this.handleMapClick = this.handleMapClick.bind(this);
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(position =>
      this.setState({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      })
    );
  }

  handleMapClick = (ref, map, ev) => {
    const location = ev.latLng;
    //console.log(location.lat, location.lng);
    this.setState(prevState => ({
      locations: [...prevState.locations, location],
      latNew: location.lat(),
      lngNew: location.lng(),
    }));
    const lat=this.state.latNew;
    const lng=this.state.lngNew;
    //console.log(location);
    const value= {lat,lng};
    this.props.updateData(value);
    map.panTo(location);
  };
  mapClicked = event => {
    console.log("You clicked!");
  };

  render() {
    if (!this.props.loaded) {
      return <div>Loading...</div>;
    }
    const style = {
      width: "90%",
      height: "60vh",
      padding: "0rem 0rem",

    };
    return (
      <div className="map">
      <Map
        google={this.props.google}
        zoom={11}
        style={style}
        initialCenter={{
          lat: this.state.lat,
          lng: this.state.lng
        }}
        center={{
          lat: this.state.lat,
          lng: this.state.lng
        }}
        onClick={this.handleMapClick}
      >
        <Marker
          title={"IT IS U, I thing"}
          position={{
            lat: this.state.lat,
            lng: this.state.lng
          }}
        />
        
        {this.state.locations.map((location, i) => {
          return (
            <Marker
              key={i}
              position={{ lat: location.lat(), lng: location.lng() }}
            />
          );
        })}
      </Map>
      </div>  
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyD20vtkGrOxf7Nq0ZCRO5-EMor6cp92bMI"
})(MapContainer2);
