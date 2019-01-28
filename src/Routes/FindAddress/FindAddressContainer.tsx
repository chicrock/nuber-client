import React from "react";
import ReactDOM from "react-dom";
import { RouteComponentProps } from "react-router-dom";
import { toast } from "react-toastify";
import { geoCode, reverseGeoCode } from "src/mapHelpers";
import routes from "src/routes";
import FindAddressPresenter from "./FindAddressPresenter";

interface IState {
  lat: number;
  lng: number;
  address: string;
}

interface IProps extends RouteComponentProps<any> {
  google: any;
}

class FindAddressContainer extends React.Component<IProps, IState> {
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
        onPickPlace={this.onPickPlace}
      />
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

    this.reverseGeoCodeAddress(latitude, longitude);
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
      minZoom: 8,
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

    this.reverseGeoCodeAddress(lat, lng);
  };

  public onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = event;
    this.setState({
      [name]: value,
    } as any);
  };

  public onInputBlur = async () => {
    const { address } = this.state;
    const result = await geoCode(address);

    if (result === false) {
      toast.error("Can't find location");
    } else {
      const { formatted_address, lat, lng } = result;

      this.setState({
        address: formatted_address,
        lat,
        lng,
      });

      this.map.panTo({ lat, lng });
    }
  };

  public reverseGeoCodeAddress = async (lat: number, lng: number) => {
    const address = await reverseGeoCode(lat, lng);

    if (address !== false) {
      this.setState({
        address,
      });
    }
  };

  public onPickPlace = () => {
    const { address, lat, lng } = this.state;
    const { history } = this.props;

    history.push({
      pathname: routes.addPlace,
      state: {
        address,
        lat,
        lng,
      },
    });
    console.log(address, lat, lng);
  };
}

export default FindAddressContainer;
