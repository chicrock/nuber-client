import { GoogleApiWrapper } from "google-maps-react";
import FindAddressContainer from "./FindAddressContainer";

const { GOOGLE_MAPS_API_KEY } = process.env;

export default GoogleApiWrapper({ apiKey: GOOGLE_MAPS_API_KEY || "" })(
  FindAddressContainer as any
);
