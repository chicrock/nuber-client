import React from "react";
import ReactDOM from "react-dom";
import { toast } from "react-toastify";
import styled from "../../typed-components";
import FindAddressPresenter from "./FindAddressPresenter";

const Container = styled.div``;

class FindAddressContainer extends React.Component<any> {
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
  };
}

export default FindAddressContainer;
