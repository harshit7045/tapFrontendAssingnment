import { useState, useEffect } from 'react';

export function useGeolocation(options = { enableHighAccuracy: true, maximumAge: 10000, timeout: 20000 }) {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    const watcher = navigator.geolocation.watchPosition(
      pos => setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy }),
      err => setError(err.message),
      options
    );
    return () => navigator.geolocation.clearWatch(watcher);
  }, [options]);

  return { position, error };
}
