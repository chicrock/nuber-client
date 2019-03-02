import { SubscribeToMoreOptions } from "apollo-boost";
import React from "react";
import { graphql, Mutation, MutationFn, Query } from "react-apollo";
import ReactDOM from "react-dom";
import { RouteComponentProps } from "react-router";
import { toast } from "react-toastify";
import { geoCode, reverseGeoCode } from "src/mapHelpers";
import { USER_PROFILE } from "src/sharedQueries";
import {
  acceptRide,
  acceptRideVariables,
  getDrivers,
  getRides,
  reportMovement,
  reportMovementVariables,
  requestRide,
  requestRideVariables,
  userProfile,
} from "src/types/api";
import HomePresenter from "./HomePresenter";
import {
  ACCEPT_RIDE,
  GET_NEARBY_DRIVERS,
  GET_NEARBY_RIDE,
  REPORT_LOCATION,
  REQUEST_RIDE,
  SUBSCRIBE_NEARBY_RIDES,
} from "./HomeQueries";

interface IState {
  distance?: string;
  duration?: string;
  fromAddress?: string;
  isDriving: boolean;
  isMenuOpen: boolean;
  lat: number;
  lng: number;
  orientation: number;
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
class GetNearbyRides extends Query<getRides> {}
class RequestRideMutation extends Mutation<requestRide, requestRideVariables> {}
class AcceptRide extends Mutation<acceptRide, acceptRideVariables> {}

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
    isDriving: false,
    isMenuOpen: false,
    lat: 0,
    lng: 0,
    orientation: 0,
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

    window.addEventListener("deviceorientation", this.handleOrientation, true);
  }
  public render() {
    const {
      distance,
      duration,
      fromAddress,
      isDriving,
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
        onCompleted={this.handleRideRequest}
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
          <GetNearbyRides query={GET_NEARBY_RIDE} skip={!isDriving}>
            {({ subscribeToMore, data: nearbyRide }) => {
              const rideSubscriptionOptions: SubscribeToMoreOptions = {
                document: SUBSCRIBE_NEARBY_RIDES,
                updateQuery: this.handleSubscriptionUpdate,
              };

              if (isDriving) {
                subscribeToMore(rideSubscriptionOptions);
              }

              return (
                <ProfileQuery
                  query={USER_PROFILE}
                  onCompleted={this.handleProfileQuery}
                >
                  {({ data, loading }) => (
                    <NearbyQuery
                      query={GET_NEARBY_DRIVERS}
                      pollInterval={5000}
                      skip={isDriving}
                      onCompleted={this.handleNearbyDrivers}
                    >
                      {({}) => (
                        <AcceptRide mutation={ACCEPT_RIDE}>
                          {acceptRideFn => (
                            <HomePresenter
                              acceptRideFn={acceptRideFn}
                              data={data}
                              isMenuOpen={isMenuOpen}
                              loading={loading}
                              mapRef={this.mapRef}
                              nearbyRide={nearbyRide}
                              onInputChange={this.onInputChange}
                              onAddressSubmit={this.onAddressSubmit}
                              price={price}
                              requestRideFn={requestRideFn}
                              toggleMenu={this.toggleMenu}
                              toAddress={toAddress}
                            />
                          )}
                        </AcceptRide>
                      )}
                    </NearbyQuery>
                  )}
                </ProfileQuery>
              );
            }}
          </GetNearbyRides>
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
  public handleGeoSuccess = (position: Position) => {
    const {
      coords: { latitude, longitude },
    } = position;
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

              existingDriver.setIcon({
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                rotation: driver.lastOrientation || 0,
                scale: 5,
              });
            } else {
              const markerOptions: google.maps.MarkerOptions = {
                icon: {
                  path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                  rotation: driver.lastOrientation || 0,
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
  public handleProfileQuery = (data: userProfile) => {
    const { GetMyProfile } = data;
    const { isDriving: localDriving } = this.state;

    if (GetMyProfile.user) {
      const {
        user: { isDriving },
      } = GetMyProfile;

      if (localDriving !== isDriving) {
        this.setState({
          isDriving,
        });
      }
    }
  };
  public handleRideRequest = (data: requestRide) => {
    const { RequestRide } = data;
    if (RequestRide.ok) {
      toast.success("Drive requested, finding a driver");
    } else {
      toast.error(RequestRide.error);
    }
  };

  public handleOrientation = (data: DeviceOrientationEvent) => {
    const { alpha } = data;
    const { lat, lng } = this.state;
    const { reportLocation } = this.props;

    if (alpha) {
      this.setState({
        orientation: alpha,
      });

      reportLocation({
        variables: {
          lat,
          lng,
          orientation: alpha,
        },
      });
    }
  };

  public handleSubscriptionUpdate = (prev, { subscriptionData }) => {
    if (!subscriptionData.data) {
      return prev;
    }

    const newObject = Object.assign({}, prev, {
      GetNearbyRide: {
        ...prev.GetNearbyRide,
        ride: subscriptionData.data.NearbyRideSubscription,
      },
    });

    return newObject;
  };
}

export default graphql<any, reportMovement, reportMovementVariables>(
  REPORT_LOCATION,
  {
    name: "reportLocation",
  }
)(HomeContainer);
