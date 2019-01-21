import React from "react";
import { Mutation } from "react-apollo";
import { RouteComponentProps } from "react-router";
import { toast } from "react-toastify";
import { GET_PLACES } from "src/sharedQueries";
import { addPlace, addPlaceVariables } from "src/types/api";
import AddPlacePresenter from "./AddPlacePersenter";
import { ADD_PLACE } from "./AddPlaceQueries";

interface IState {
  address: string;
  name: string;
  lat: number;
  lng: number;
}

interface IProps extends RouteComponentProps<any> {}

class AddPlaceQuery extends Mutation<addPlace, addPlaceVariables> {}

class AddPlaceContainer extends React.Component<IProps, IState> {
  public state = {
    address: "",
    lat: 1.2345,
    lng: 2.3456,
    name: "",
  };
  public render() {
    const { address, name, lat, lng } = this.state;
    const { history } = this.props;
    return (
      <AddPlaceQuery
        mutation={ADD_PLACE}
        onCompleted={data => {
          const { AddPlace } = data;
          if (AddPlace.ok) {
            toast.success("Place added");
            setTimeout(() => {
              history.push("/places");
            }, 2000);
          } else {
            toast.error(AddPlace.error);
          }
        }}
        refetchQueries={[{ query: GET_PLACES }]}
        variables={{
          address,
          isFav: false,
          lat,
          lng,
          name,
        }}
      >
        {(addPlaceFn, { loading }) => (
          <AddPlacePresenter
            address={address}
            name={name}
            loading={loading}
            onInputChange={this.onInputchange}
            addPlaceFn={addPlaceFn}
          />
        )}
      </AddPlaceQuery>
    );
  }

  public onInputchange: React.ChangeEventHandler<
    HTMLInputElement
  > = async event => {
    const {
      target: { name, value },
    } = event;

    this.setState({
      [name]: value,
    } as any);
  };
}

export default AddPlaceContainer;
