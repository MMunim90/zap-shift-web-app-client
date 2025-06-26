import React from "react";
import { useLoaderData } from "react-router";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom green marker icon
const greenIcon = new L.Icon({
  iconUrl:
    "https://i.ibb.co/YBCrkSnb/marker.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const Coverage = () => {
  const branches = useLoaderData(); 

  return (
    <div className="py-12 px-4 md:px-12">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
        We are available in 64 districts
      </h2>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search district name..."
          className="input input-bordered w-full max-w-md"
        />
      </div>

      <div className="h-[500px] w-full max-w-6xl mx-auto rounded-3xl border-3 border-[#CAEB66] shadow-md overflow-hidden">
        <MapContainer
          center={[23.8103, 90.4125]}
          zoom={7}
          scrollWheelZoom={true}
          className="h-full w-full z-0"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          />
          {branches.map((branch, idx) => (
            <Marker
              key={idx}
              position={[branch.latitude, branch.longitude]}
              icon={greenIcon}
            >
              <Popup>
                <strong>{branch.district}</strong>
                <br />
                {branch.covered_area.join(", ")}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default Coverage;
