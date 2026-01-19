import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { MapMarker } from "@/types/map";

interface EventsMapViewProps {
  markers?: MapMarker[];
}
const EventsMapView = ({ markers }: EventsMapViewProps) => {
  return (
    <MapContainer
      center={[27.3314, 88.6138]}
      zoom={15}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers?.map((marker, index) => (
        <Marker position={marker.geocode} title={marker.title}>
          <Popup>
            {marker.title} <br /> Lat: {marker.geocode[0]}, Lng:{" "}
            {marker.geocode[1]}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default EventsMapView;
