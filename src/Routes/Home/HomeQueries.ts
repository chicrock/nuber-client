import { gql } from "apollo-boost";

export const REPORT_LOCATION = gql`
  mutation reportMovement($lat: Float!, $lng: Float!, $orientation: Float) {
    ReportMovement(
      lastLat: $lat
      lastLng: $lng
      lastOrientation: $orientation
    ) {
      ok
      error
    }
  }
`;

export const GET_NEARBY_DRIVERS = gql`
  query getDrivers {
    GetNearbyDrivers {
      ok
      error
      drivers {
        id
        lastLat
        lastLng
        lastOrientation
      }
    }
  }
`;

export const REQUEST_RIDE = gql`
  mutation requestRide(
    $pickupAddress: String!
    $pickupLat: Float!
    $pickupLng: Float!
    $dropOffAddress: String!
    $dropOffLat: Float!
    $dropOffLng: Float!
    $price: Float!
    $distance: String!
    $duration: String!
  ) {
    RequestRide(
      pickupAddress: $pickupAddress
      pickupLat: $pickupLat
      pickupLng: $pickupLng
      dropOffAddress: $dropOffAddress
      dropOffLat: $dropOffLat
      dropOffLng: $dropOffLng
      price: $price
      distance: $distance
      duration: $duration
    ) {
      ok
      error
      ride {
        id
      }
    }
  }
`;

export const GET_NEARBY_RIDE = gql`
  query getRides {
    GetNearbyRide {
      ok
      error
      ride {
        id
        pickupAddress
        dropOffAddress
        price
        distance
        duration
        passenger {
          fullName
          profilePhoto
        }
      }
    }
  }
`;

export const ACCEPT_RIDE = gql`
  mutation acceptRide($rideId: Int!) {
    UpdateRideStatus(rideId: $rideId, status: ACCEPTED) {
      ok
      error
      rideId
    }
  }
`;

export const SUBSCRIBE_NEARBY_RIDES = gql`
  subscription nearbyRides {
    NearbyRideSubscription {
      id
      pickupAddress
      dropOffAddress
      price
      distance
      duration
      passenger {
        fullName
        profilePhoto
      }
    }
  }
`;
