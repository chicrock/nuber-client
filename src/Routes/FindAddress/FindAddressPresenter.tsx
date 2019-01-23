import React from "react";
import Helmet from "react-helmet";
import styled from "../../typed-components";

const Container = styled.div``;
const Map = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 1;
`;

const Center = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  z-index: 2;
  font-size: 20px;
  margin: auto;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

interface IProps {
  mapRef: any;
}

/// Stateless Component cannot get ref. So, make stateful component
class FindAddressPresenter extends React.Component<IProps> {
  public render() {
    const { mapRef } = this.props;

    return (
      <Container>
        <Helmet>
          <title>Find Address | Nuber</title>
        </Helmet>
        <Center>📍</Center>
        <Map ref={mapRef} />
      </Container>
    );
  }
}

export default FindAddressPresenter;
