import React from "react";
import { Mutation } from "react-apollo";
import { GET_PLACES } from "src/sharedQueries";
import { editPlace, editPlaceVariables } from "src/types/api";
import styled from "../../typed-components";
import PlacePresenter from "./PlacePresenter";
import { EDIT_PLACE } from "./PlaceQueries";

const Conatiner = styled.div``;

interface IProps {
  fav: boolean;
  name: string;
  address: string;
  id: number;
}

class FavMutation extends Mutation<editPlace, editPlaceVariables> {}

class PlaceContainer extends React.Component<IProps> {
  public render() {
    const { id, fav, name, address } = this.props;

    return (
      <Conatiner>
        <FavMutation
          mutation={EDIT_PLACE}
          variables={{
            isFav: !fav,
            placeId: id,
          }}
          refetchQueries={[{ query: GET_PLACES }]}
        >
          {editPlaceFn => (
            <PlacePresenter
              fav={fav}
              name={name}
              address={address}
              onStarPress={editPlaceFn}
            />
          )}
        </FavMutation>
      </Conatiner>
    );
  }
}

export default PlaceContainer;
