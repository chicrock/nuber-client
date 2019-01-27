import axios from "axios";
import { toast } from "react-toastify";

export const geoCode = () => null;

export const reverseGeoCode = async (lat: number, lng: number) => {
  const { REACT_APP_GOOGLE_MAPS_API_KEY } = process.env;
  const URL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${REACT_APP_GOOGLE_MAPS_API_KEY}`;
  const { data } = await axios(URL);

  if (!data.error_message) {
    const { results } = data;
    if (results[0]) {
      const firstPlace = results[0];
      const { formatted_address = "" } = firstPlace;

      return formatted_address;
    } else {
      toast.error("Can't find address!");
    }
  } else {
    toast.error(data.error_message);
  }
};
