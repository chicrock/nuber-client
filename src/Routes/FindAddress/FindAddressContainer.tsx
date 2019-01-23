import React from "react";
import ReactDOM from "react-dom";
import { toast } from "react-toastify";
import styled from "../../typed-components";
import FindAddressPresenter from "./FindAddressPresenter";

interface IState {
  lat: number;
  lng: number;
}

const Container = styled.div``;

class FindAddressContainer extends React.Component<any, IState> {
  public state = {
    lat: 0,
    lng: 0,
  };
  public mapRef: any;
  public map: google.maps.Map;

  constructor(props) {
    super(props);

    this.mapRef = React.createRef();
  }

  public componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      this.handleGeoSuccess,
      this.handleGeoError
    );
  }

  public render() {
    return (
      <Container>
        <FindAddressPresenter mapRef={this.mapRef} />
      </Container>
    );
  }

  public handleGeoSuccess = (position: Position) => {
    const {
      coords: { latitude, longitude },
    } = position;

    this.setState({
      lat: latitude,
      lng: longitude,
    });

    this.loadMap(latitude, longitude);
  };

  public handleGeoError = (error: PositionError) => {
    toast.error(error.message);
  };

  public loadMap = (lat, lng) => {
    const { google } = this.props;
    const maps = google.maps;
    const mapNode = ReactDOM.findDOMNode(this.mapRef.current);
    const mapConfig: google.maps.MapOptions = {
      center: {
        lat,
        lng,
      },
      disableDefaultUI: true,
      zoom: 11,
    };
    this.map = new maps.Map(mapNode, mapConfig);
    this.map.addListener("dragend", this.handleDragEnd);
  };

  public handleDragEnd = () => {
    const newCenter = this.map.getCenter();
    const lat = newCenter.lat();
    const lng = newCenter.lng();

    this.setState({
      lat,
      lng,
    });
  };
}

export default FindAddressContainer;
