import { SubscribeToMoreOptions } from "apollo-boost";
import React from "react";
import { Mutation, Query } from "react-apollo";
import { RouteComponentProps } from "react-router-dom";
import { USER_PROFILE } from "src/sharedQueries";
import {
  getRide,
  getRideVariables,
  updateRide,
  updateRideVariables,
  userProfile,
} from "src/types/api";
import RidePresenter from "./RidePresenter";
import { GET_RIDE, RIDE_SUBSCRIPTION, UPDATE_RIDE_STATUS } from "./RideQueries";

class RideQuery extends Query<getRide, getRideVariables> {}
class ProfileQuery extends Query<userProfile> {}
class RideUpdate extends Mutation<updateRide, updateRideVariables> {}

interface IRideSubscribeToMoreOptions
  extends SubscribeToMoreOptions<any, getRideVariables, any> {}

interface IProps extends RouteComponentProps<any> {}

class RideContainer extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);

    const {
      history,
      match: {
        params: { rideId },
      },
    } = props;

    if (!rideId) {
      history.push("/");
    }
  }

  public render() {
    const {
      match: {
        params: { rideId },
      },
    } = this.props;

    return (
      <ProfileQuery query={USER_PROFILE}>
        {({ data: userData }) => (
          <RideQuery
            query={GET_RIDE}
            variables={{ rideId: parseInt(rideId, 10) }}
          >
            {({ data, loading, subscribeToMore }) => {
              const subscribeOptions: IRideSubscribeToMoreOptions = {
                document: RIDE_SUBSCRIPTION,
              };

              subscribeToMore(subscribeOptions);

              return (
                <RideUpdate mutation={UPDATE_RIDE_STATUS}>
                  {updateRideFn => (
                    <RidePresenter
                      data={data}
                      loading={loading}
                      userData={userData}
                      updateRideFn={updateRideFn}
                    />
                  )}
                </RideUpdate>
              );
            }}
          </RideQuery>
        )}
      </ProfileQuery>
    );
  }

  public handleSubscriptionUpdate = (prev, { subscriptionData }) => {
    if (!subscriptionData.data) {
      return prev;
    }

    console.log(prev, subscriptionData);
  };
}

export default RideContainer;
