import { useState, useEffect } from 'react';

const Tracker = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [watchId, setWatchId] = useState(null);

  useEffect(() => {
    const successCallback = (position) => {
      const { latitude, longitude } = position.coords;
      setLocation({ latitude, longitude });
      setError(null);
    };

    const errorCallback = (error) => {
      setError(error.message);
    };

    if (navigator.geolocation) {
      const id = navigator.geolocation.watchPosition(successCallback, errorCallback, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
      setWatchId(id);
    } else {
      setError('Geolocation is not supported by this browser.');
    }

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return { location, error };
};

export default Tracker;
