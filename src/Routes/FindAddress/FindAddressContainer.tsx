import React from "react";
import ReactDOM from "react-dom";
import { toast } from "react-toastify";
import { reverseGeoCode } from "src/mapHelpers";
import FindAddressPresenter from "./FindAddressPresenter";

interface IState {
  lat: number;
  lng: number;
  address: string;
}

class FindAddressContainer extends React.Component<any, IState> {
  public state = {
    address: "",
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
    const { address } = this.state;
    return (
      <FindAddressPresenter
        mapRef={this.mapRef}
        address={address}
        onInputChange={this.onInputChange}
        onInputBlur={this.onInputBlur}
      />
    );
  }

  public handleGeoSuccess = async (position: Position) => {
    const {
      coords: { latitude, longitude },
    } = position;

    const address = await reverseGeoCode(latitude, longitude);

    this.setState({
      address,
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

  public handleDragEnd = async () => {
    const newCenter = this.map.getCenter();
    const lat = newCenter.lat();
    const lng = newCenter.lng();
    const address = await reverseGeoCode(lat, lng);

    this.setState({
      address,
      lat,
      lng,
    });
  };

  public onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = event;
    this.setState({
      [name]: value,
    } as any);
  };

  public onInputBlur = () => {
    console.log("Address updated");
  };
}

export default FindAddressContainer;
