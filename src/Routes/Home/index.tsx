import { GoogleApiWrapper } from "google-maps-react";
import HomeContainer from "./HomeContainer";

const { REACT_APP_GOOGLE_MAPS_API_KEY } = process.env;

export default GoogleApiWrapper({
  apiKey: REACT_APP_GOOGLE_MAPS_API_KEY || "",
})(HomeContainer as any);
