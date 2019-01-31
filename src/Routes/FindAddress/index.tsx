import { GoogleApiWrapper } from "google-maps-react";
import { GOOGLE_MAPS_API_KEY } from "src/keys";
import FindAddressContainer from "./FindAddressContainer";

export default GoogleApiWrapper({
  apiKey: GOOGLE_MAPS_API_KEY || "",
})(FindAddressContainer as any);
