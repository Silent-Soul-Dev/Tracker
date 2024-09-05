// src/components/MapDisplay.js
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapDisplay = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    // Fetch the most recent location from the backend
    const fetchLocation = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/getLocation');
        const data = await response.json();
        setLocation(data);
      } catch (error) {
        console.error('Error fetching location:', error);
      }
    };

    fetchLocation();
  }, []);

  return (
    <div>
      <h2>Latest Location</h2>
      {location ? (
        <MapContainer
          center={[location.latitude, location.longitude]}
          zoom={13}
          style={{ height: '500px', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[location.latitude, location.longitude]}>
            <Popup>
              Latitude: {location.latitude} <br /> Longitude: {location.longitude}
            </Popup>
          </Marker>
        </MapContainer>
      ) : (
        <p>Loading location...</p>
      )}
    </div>
  );
};

export default MapDisplay;
