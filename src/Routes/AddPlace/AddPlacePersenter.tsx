import React from "react";
import { MutationFn } from "react-apollo";
import Helmet from "react-helmet";
import { Link } from "react-router-dom";
import Button from "src/Components/Button";
import Form from "src/Components/Form";
import Header from "src/Components/Header";
import Input from "src/Components/Input";
import styled from "../../typed-components";

const Container = styled.div`
  padding: 0 40px;
`;

const ExtendedInput = styled(Input)`
  margin-bottom: 40px;
`;

const ExtendedLink = styled(Link)`
  text-decoration: underline;
  margin-bottom: 20px;
  display: block;
`;

interface IProps {
  address: string;
  name: string;
  loading: boolean;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  addPlaceFn: MutationFn;
}

const AddPlacePresenter: React.SFC<IProps> = ({
  address,
  name,
  loading,
  onInputChange,
  addPlaceFn,
}) => (
  <React.Fragment>
    <Helmet>
      <title>Add Place | Nuber</title>
    </Helmet>
    <Header title="Add Place" backTo={"/"} />
    <Container>
      <Form submitFn={addPlaceFn}>
        <ExtendedInput
          placeholder={"Name"}
          type={"text"}
          value={name}
          onChange={onInputChange}
          name={"name"}
        />
        <ExtendedInput
          placeholder={"Address"}
          type={"text"}
          value={address}
          onChange={onInputChange}
          name={"address"}
        />
        <ExtendedLink to={"/find-address"}>Pick place from map</ExtendedLink>
        <Button onClick={null} value={loading ? "Adding place" : "Add Place"} />
      </Form>
    </Container>
  </React.Fragment>
);

export default AddPlacePresenter;
