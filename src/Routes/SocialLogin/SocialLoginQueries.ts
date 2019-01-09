import { gql } from "apollo-boost";

export const FACEBOOK_CONNECT = gql`
  mutation facebookConnect(
    $email: String
    $fbId: String!
    $firstName: String!
    $lastName: String!
  ) {
    FacebookConnect(
      firstName: $firstName
      lastName: $lastName
      email: $email
      fbId: $fbId
    ) {
      ok
      error
      token
    }
  }
`;
