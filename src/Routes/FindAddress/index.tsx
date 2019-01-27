import { GoogleApiWrapper } from "google-maps-react";
import FindAddressContainer from "./FindAddressContainer";

const { REACT_APP_GOOGLE_MAPS_API_KEY } = process.env;

export default GoogleApiWrapper({
  apiKey: REACT_APP_GOOGLE_MAPS_API_KEY || "",
})(FindAddressContainer as any);
