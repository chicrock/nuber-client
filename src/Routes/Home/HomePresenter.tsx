import React from "react";
import { MutationFn } from "react-apollo";
import Helmet from "react-helmet";
import Sidebar from "react-sidebar";
import { getRides, userProfile } from "src/types/api";
import AddressBar from "../../Components/AddressBar";
import Button from "../../Components/Button";
import Menu from "../../Components/Menu";
import RidePopUp from "../../Components/RidePopUp";
import styled from "../../typed-components";

const Container = styled.div``;

const MenuButton = styled.button`
  appearance: none;
  padding: 10px;
  position: absolute;
  top: 10px;
  left: 10px;
  text-align: center;
  font-weight: 800;
  border: 0;
  cursor: pointer;
  font-size: 20px;
  transform: rotate(90deg);
  z-index: 2;
  background-color: transparent;
`;

const Map = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
`;

const ExtendedButton = styled(Button)`
  position: absolute;
  bottom: 50px;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 10;
  height: auto;
  width: 80%;
`;

const RequestButton = styled(ExtendedButton)`
  bottom: 100px;
`;

interface IProps {
  acceptRideFn?: MutationFn;
  data?: userProfile;
  loading: boolean;
  isMenuOpen: boolean;
  toggleMenu: () => void;
  mapRef: any;
  nearbyRide?: getRides;
  toAddress: string;
  onAddressSubmit: () => void;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  price: number;
  requestRideFn: MutationFn;
}

const HomePresenter: React.SFC<IProps> = ({
  acceptRideFn,
  data: { GetMyProfile: { user = null } = {} } = {},
  isMenuOpen,
  toggleMenu,
  loading,
  toAddress,
  mapRef,
  nearbyRide: { GetNearbyRide: { ride = null } = {} } = {},
  onInputChange,
  onAddressSubmit,
  price,
  requestRideFn,
}) => (
  <Container>
    <Helmet>
      <title>Home | Nuber</title>
    </Helmet>
    <Sidebar
      sidebar={<Menu />}
      open={isMenuOpen}
      onSetOpen={toggleMenu}
      styles={{
        sidebar: { width: "80%", backgroundColor: "white", zIndex: "10" },
      }}
    >
      {!loading && <MenuButton onClick={toggleMenu}>|||</MenuButton>}
      {user && !user.isDriving && (
        <React.Fragment>
          <AddressBar
            name={"toAddress"}
            onChange={onInputChange}
            value={toAddress}
            onBlur={null}
          />
          <ExtendedButton
            onClick={onAddressSubmit}
            disabled={toAddress === ""}
            value={price ? "Change Address" : "Pick Address"}
          />
        </React.Fragment>
      )}
      {price > 0 && (
        <RequestButton
          onClick={requestRideFn}
          disabled={toAddress === ""}
          value={`Request Ride ($${price})`}
        />
      )}

      {ride && (
        <RidePopUp
          id={ride.id}
          pickUpAddress={ride.pickupAddress}
          dropOffAddress={ride.dropOffAddress}
          price={ride.price}
          distance={ride.distance}
          passengerName={ride.passenger.fullName!}
          passengerPhoto={ride.passenger.profilePhoto!}
          acceptRideFn={acceptRideFn}
        />
      )}

      <Map ref={mapRef} />
    </Sidebar>
  </Container>
);

export default HomePresenter;
