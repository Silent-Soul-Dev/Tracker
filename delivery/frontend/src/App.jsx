import React, { useEffect, useState } from 'react';
import Tracker from './components/Tracker'; // Assuming you have this custom hook for location tracking

const App = () => {
    const { location, error } = Tracker(); // Get location and error from Tracker hook
    const [device2Location] = useState({ latitude: 40.7128, longitude: -74.0060 }); // Example location for comparison
    const [distance, setDistance] = useState(null); // State to store calculated distance

    // Haversine formula to calculate the distance between two points
    const haversineDistance = (coords1, coords2) => {
        const toRad = (x) => (x * Math.PI) / 180;

        const lat1 = coords1.latitude;
        const lon1 = coords1.longitude;
        const lat2 = coords2.latitude;
        const lon2 = coords2.longitude;

        const R = 6371; // Radius of the Earth in kilometers
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in kilometers
    };

    // Function to send location data to the server
    const sendLocationToServer = async (latitude, longitude) => {
        try {
            const response = await fetch('http://localhost:5000/api/updateLocation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ latitude, longitude }),
            });
            const data = await response.json();
            console.log('Server response:', data);
        } catch (err) {
            console.error('Error sending location to server:', err);
        }
    };

    // useEffect to send location and calculate distance only when location changes
    useEffect(() => {
        if (location) {
            // Send the current location to the backend
            sendLocationToServer(location.latitude, location.longitude);

            // Calculate the distance only if it's not calculated yet or location has changed
            const newDistance = haversineDistance(location, device2Location);
            if (newDistance !== distance) {
                setDistance(newDistance); // Update the distance if it's changed
            }
        }
    }, [location, device2Location, distance]); // Only re-run when location or distance changes

    return (
        <div>
            <h1>Location Tracker</h1>
            {error && <p>Error: {error}</p>}
            {location ? (
                <div>
                    <p>
                        Latitude: {location.latitude}<br />
                        Longitude: {location.longitude}
                    </p>
                    <p>
                        Distance to Device 2: {distance ? distance.toFixed(2) + ' km' : 'Calculating...'}
                    </p>
                </div>
            ) : (
                <p>Fetching location...</p>
            )}
        </div>
    );
};

export default App;
