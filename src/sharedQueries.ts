import { gql } from "apollo-boost";

export const USER_PROFILE = gql`
  query userProfile {
    GetMyProfile {
      ok
      error
      user {
        email
        fullName
        firstName
        isDriving
        lastName
        profilePhoto
      }
    }
  }
`;
