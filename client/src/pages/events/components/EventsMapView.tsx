import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { MapMarker } from "@/types/map";

interface EventsMapViewProps {
  markers?: MapMarker[];
  onSelect: (eventId: string) => void;
}
const EventsMapView = ({ markers, onSelect }: EventsMapViewProps) => {
  return (
    <MapContainer
      center={[27.3314, 88.6138]}
      zoom={15}
      style={{
        height: "100%",
        width: "100%",
        borderTopLeftRadius: "1rem",
        borderBottomLeftRadius: "1rem",
        zIndex: 1,
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers?.map((marker, index) => (
        <Marker
          position={marker.geocode}
          title={marker.title}
          riseOnHover
          eventHandlers={{
            click: (e) => {
              onSelect(marker.id);
            },
          }}
          key={marker.id}
        >
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
