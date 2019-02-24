import { gql } from "apollo-boost";

export const REPORT_LOCATION = gql`
  mutation reportMovement($lat: Float!, $lng: Float!) {
    ReportMovement(lastLat: $lat, lastLng: $lng) {
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
