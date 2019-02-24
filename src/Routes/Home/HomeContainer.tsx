import React from "react";
import { graphql, Mutation, MutationFn, Query } from "react-apollo";
import ReactDOM from "react-dom";
import { RouteComponentProps } from "react-router";
import { toast } from "react-toastify";
import { geoCode, reverseGeoCode } from "src/mapHelpers";
import { USER_PROFILE } from "src/sharedQueries";
import {
  getDrivers,
  reportMovement,
  reportMovementVariables,
  requestRide,
  requestRideVariables,
  userProfile,
} from "src/types/api";
import HomePresenter from "./HomePresenter";
import {
  GET_NEARBY_DRIVERS,
  REPORT_LOCATION,
  REQUEST_RIDE,
} from "./HomeQueries";

interface IState {
  distance?: string;
  duration?: string;
  fromAddress?: string;
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
class NearbyQuery extends Query<getDrivers> {}
class RequestRideMutation extends Mutation<requestRide, requestRideVariables> {}

class HomeContainer extends React.Component<IProps, IState> {
  public mapRef: any;
  public map: google.maps.Map;
  public userMarker: google.maps.Marker;
  public toMarker: google.maps.Marker;
  public directions: google.maps.DirectionsRenderer;
  public drivers: google.maps.Marker[];

  public state = {
    distance: "",
    duration: "",
    fromAddress: "",
    isMenuOpen: false,
    lat: 0,
    lng: 0,
    price: 0,
    toAddress: "Great Ormond St, London WC1N 3JH 영국",
    toLat: 0,
    toLng: 0,
  };
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
    this.drivers = [];
  }
  public componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      this.handleGeoSuccess,
      this.handleGeoError
    );
  }
  public render() {
    const {
      distance,
      duration,
      fromAddress,
      isMenuOpen,
      lat,
      lng,
      price,
      toAddress,
      toLat,
      toLng,
    } = this.state;

    return (
      <RequestRideMutation
        mutation={REQUEST_RIDE}
        variables={{
          distance,
          dropOffAddress: toAddress,
          dropOffLat: toLat,
          dropOffLng: toLng,
          duration: duration || "",
          pickupAddress: fromAddress,
          pickupLat: lat,
          pickupLng: lng,
          price,
        }}
      >
        {requestRideFn => (
          <ProfileQuery query={USER_PROFILE}>
            {({ data, loading }) => (
              <NearbyQuery
                query={GET_NEARBY_DRIVERS}
                pollInterval={1000}
                skip={
                  (data &&
                    data.GetMyProfile &&
                    data.GetMyProfile.user &&
                    data.GetMyProfile.user.isDriving) ||
                  false
                }
                onCompleted={this.handleNearbyDrivers}
              >
                {({}) => (
                  <HomePresenter
                    data={data}
                    loading={loading}
                    isMenuOpen={isMenuOpen}
                    toggleMenu={this.toggleMenu}
                    mapRef={this.mapRef}
                    toAddress={toAddress}
                    onInputChange={this.onInputChange}
                    onAddressSubmit={this.onAddressSubmit}
                    price={price}
                    requestRideFn={requestRideFn}
                  />
                )}
              </NearbyQuery>
            )}
          </ProfileQuery>
        )}
      </RequestRideMutation>
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
    this.getFromAddress(latitude, longitude);
    this.loadMap(latitude, longitude);
  };
  public getFromAddress = async (lat: number, lng: number) => {
    const address = await reverseGeoCode(lat, lng);
    if (address) {
      this.setState({
        fromAddress: address,
      });
      console.log(address);
    }
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
    this.getFromAddress(lat, lng);
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

  public handleNearbyDrivers = (data: {} | getDrivers) => {
    if ("GetNearbyDrivers" in data) {
      const {
        GetNearbyDrivers: { drivers, ok },
      } = data;
      if (ok && drivers) {
        for (const driver of drivers) {
          if (driver && driver.lastLat && driver.lastLng) {
            const existingDriver:
              | google.maps.Marker
              | undefined = this.drivers.find(
              (driverMarker: google.maps.Marker) => {
                const markerID = driverMarker.get("ID");
                return markerID === driver.id;
              }
            );

            if (existingDriver) {
              existingDriver.setPosition({
                lat: driver.lastLat,
                lng: driver.lastLng,
              });
            } else {
              const markerOptions: google.maps.MarkerOptions = {
                icon: {
                  path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                  scale: 5,
                },
                position: {
                  lat: driver.lastLat,
                  lng: driver.lastLng,
                },
              };

              const newMarker: google.maps.Marker = new google.maps.Marker(
                markerOptions
              );
              this.drivers.push(newMarker);

              newMarker.set("ID", driver.id);
              newMarker.setMap(this.map);
            }
          }
        }
      }
    }
  };
}

export default graphql<any, reportMovement, reportMovementVariables>(
  REPORT_LOCATION,
  {
    name: "reportLocation",
  }
)(HomeContainer);
