import React from "react";
import { graphql, MutationFn, Query } from "react-apollo";
import ReactDOM from "react-dom";
import { RouteComponentProps } from "react-router";
import { toast } from "react-toastify";
import { geoCode } from "src/mapHelpers";
import { USER_PROFILE } from "src/sharedQueries";
import {
  reportMovement,
  reportMovementVariables,
  userProfile,
} from "src/types/api";
import HomePresenter from "./HomePresenter";
import { REPORT_LOCATION } from "./HomeQueries";

interface IState {
  distance?: string;
  duration?: string;
  isMenuOpen: boolean;
  lat: number;
  lng: number;
  price: number;
  toAddress: string;
  toLat: number;
  toLng: number;
}

interface IProps extends RouteComponentProps<any> {
  google: any;
  reportLocation: MutationFn;
}

class ProfileQuery extends Query<userProfile> {}

class HomeContainer extends React.Component<IProps, IState> {
  public mapRef: any;
  public map: google.maps.Map;
  public userMarker: google.maps.Marker;
  public toMarker: google.maps.Marker;
  public directions: google.maps.DirectionsRenderer;

  public state = {
    distance: "",
    duration: "",
    isMenuOpen: false,
    lat: 0,
    lng: 0,
    price: 0,
    toAddress: "272 High Holborn, London WC1V 7EY 영국",
    toLat: 0,
    toLng: 0,
  };
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
    const { isMenuOpen, toAddress, price } = this.state;

    return (
      <ProfileQuery query={USER_PROFILE}>
        {({ loading }) => (
          <HomePresenter
            loading={loading}
            isMenuOpen={isMenuOpen}
            toggleMenu={this.toggleMenu}
            mapRef={this.mapRef}
            toAddress={toAddress}
            onInputChange={this.onInputChange}
            onAddressSubmit={this.onAddressSubmit}
            price={price}
          />
        )}
      </ProfileQuery>
    );
  }

  public toggleMenu = () => {
    this.setState(state => {
      return {
        isMenuOpen: !state.isMenuOpen,
      };
    });
  };
  public handleGeoSuccess = (positon: Position) => {
    const {
      coords: { latitude, longitude },
    } = positon;
    this.setState({
      lat: latitude,
      lng: longitude,
    });
    this.loadMap(latitude, longitude);
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
      zoom: 13,
    };
    this.map = new maps.Map(mapNode, mapConfig);
    const userMarkerOptions: google.maps.MarkerOptions = {
      icon: {
        path: maps.SymbolPath.CIRCLE,
        scale: 7,
      },
      position: {
        lat,
        lng,
      },
    };
    this.userMarker = new maps.Marker(userMarkerOptions);
    this.userMarker.setMap(this.map);
    const watchOptions: PositionOptions = {
      enableHighAccuracy: true,
    };
    navigator.geolocation.watchPosition(
      this.handleGeoWatchSuccess,
      this.handleGeoWatchError,
      watchOptions
    );
  };
  public handleGeoWatchSuccess = (position: Position) => {
    const { reportLocation } = this.props;
    const {
      coords: { latitude: lat, longitude: lng },
    } = position;

    this.userMarker.setPosition({ lat, lng });
    this.map.panTo({ lat, lng });
    this.setState({
      lat,
      lng,
    });
    reportLocation({
      variables: {
        lat,
        lng,
      },
    });
  };
  public handleGeoWatchError = () => {
    console.log("Error watching you");
  };
  public handleGeoError = () => {
    console.log("No location");
  };

  public onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = event;
    this.setState({
      [name]: value,
    } as any);
  };
  public onAddressSubmit = async () => {
    const { toAddress, lat: lastLat, lng: lastLng } = this.state;
    const { google } = this.props;
    const maps = google.maps;
    const result = await geoCode(toAddress);
    if (result !== false) {
      const { lat, lng, formatted_address: formatedAddress } = result;

      if (this.toMarker) {
        this.toMarker.setMap(null);
      }
      const toMarkerOptions: google.maps.MarkerOptions = {
        position: {
          lat,
          lng,
        },
      };
      this.toMarker = new maps.Marker(toMarkerOptions);
      this.toMarker.setMap(this.map);

      const bounds = new google.maps.LatLngBounds();
      bounds.extend({ lat, lng });
      bounds.extend({ lat: lastLat, lng: lastLng });

      this.map.fitBounds(bounds);

      this.setState(
        {
          toAddress: formatedAddress,
          toLat: lat,
          toLng: lng,
        },
        this.createPath
      );
    }
  };

  public createPath = () => {
    const { lat, lng, toLat, toLng } = this.state;

    if (this.directions) {
      this.directions.setMap(null);
    }

    const renderOptions: google.maps.DirectionsRendererOptions = {
      polylineOptions: {
        strokeColor: "#000",
      },
      suppressMarkers: true,
    };

    this.directions = new google.maps.DirectionsRenderer(renderOptions);
    const directionService: google.maps.DirectionsService = new google.maps.DirectionsService();
    const to = new google.maps.LatLng(toLat, toLng);
    const from = new google.maps.LatLng(lat, lng);
    const directionOptions: google.maps.DirectionsRequest = {
      destination: to,
      origin: from,
      travelMode: google.maps.TravelMode.DRIVING,
    };

    directionService.route(directionOptions, this.drawRoutes);
  };

  public drawRoutes = (result, status) => {
    if (status === google.maps.DirectionsStatus.OK) {
      const { routes } = result;
      const {
        distance: { text: distance },
        duration: { text: duration },
      } = routes[0].legs[0];

      this.directions.setDirections(result);
      this.directions.setMap(this.map);

      this.setState(
        {
          distance,
          duration,
        },
        this.setPrice
      );
    } else {
      toast.error("There is no route there");
    }
  };

  public setPrice = () => {
    const { distance } = this.state;

    if (distance) {
      const price = parseFloat(distance.replace(",", "")) * 2;
      this.setState({
        price,
      });
    }
  };
}

export default graphql<any, reportMovement, reportMovementVariables>(
  REPORT_LOCATION,
  {
    name: "reportLocation",
  }
)(HomeContainer);
