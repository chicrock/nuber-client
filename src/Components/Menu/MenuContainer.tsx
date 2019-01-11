import React from "react";
import { Query } from "react-apollo";
import { USER_PROFILE } from "src/sharedQueries";
import { userProfile } from "src/types/api";
import MenuPresenter from "./MenuPresenter";

class ProfileQuery extends Query<userProfile> {}

class MenuContainer extends React.Component {
  public render() {
    return (
      <ProfileQuery query={USER_PROFILE}>
        {({ data, loading }) => <MenuPresenter data={data} loading={loading} />}
      </ProfileQuery>
    );
  }
}

export default MenuContainer;
