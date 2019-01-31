import { GoogleApiWrapper } from "google-maps-react";
import { GOOGLE_MAPS_API_KEY } from "src/keys";
import HomeContainer from "./HomeContainer";

export default GoogleApiWrapper({
  apiKey: GOOGLE_MAPS_API_KEY || "",
})(HomeContainer as any);
