import React from "react";
import Helmet from "react-helmet";
import { Link } from "react-router-dom";
import Header from "src/Components/Header";
import Place from "src/Components/Place";
import styled from "../../typed-components";

const Container = styled.div`
  padding: 0 40px;
`;

const SLink = styled(Link)`
  text-decoration: underline;
`;

interface IProps {
  data?: any;
  loading: boolean;
}

const PlacesPresenter: React.SFC<IProps> = ({
  data: { GetMyPlaces: { places = null } = {} } = {},
  loading,
}) => (
  <React.Fragment>
    <Helmet>
      <title>Places | Nuber</title>
    </Helmet>
    <Header title={"Places"} backTo={"/"} />
    <Container>
      {!loading && places && places.length === 0 && "You have no places"}
      {!loading &&
        places &&
        places.map(place => (
          <Place
            address={place!.address}
            fav={place!.isFav}
            id={place!.id}
            key={place!.id}
            name={place!.name}
          />
        ))}
      <SLink to={"/add-place"}>Add some Places!</SLink>
    </Container>
  </React.Fragment>
);

export default PlacesPresenter;
