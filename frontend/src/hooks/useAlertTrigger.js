import { useEffect, useRef, useState } from 'react';
import { haversine } from '../utils/haversine';
import { useAuth } from './useAuth';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const ALERT_INTERVAL = 20000; // 20 seconds

export function useAlertTrigger(dangerZones) {
  const { token } = useAuth();
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [lastSent, setLastSent] = useState(null);
  const [sending, setSending] = useState(false);
  const intervalRef = useRef();
  const lastAlertTime = useRef(0);

  // Watch geolocation continuously
  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    const watcher = navigator.geolocation.watchPosition(
      pos => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy });
        setError(null); // Clear error on new position
      },
      err => setError(err.message),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 20000 }
    );
    return () => navigator.geolocation.clearWatch(watcher);
  }, []);

  // Continuous check every 10 seconds
  useEffect(() => {
    function checkAndMaybeAlert() {
      if (!position || !dangerZones?.length || !token) return;
      // Check if in danger zone
      const inDanger = dangerZones.some(zone =>
        haversine(position.lat, position.lng, zone.latitude, zone.longitude) <= zone.radius
      );
      // Check network
      const nav = navigator;
      const conn = nav.connection || nav.mozConnection || nav.webkitConnection;
      const effectiveType = conn?.effectiveType || 'unknown';
      // For demo: trigger alert if network is 4g or lower
      const isPoorNetwork = effectiveType === '4g';
      // Throttle alerts
      const now = Date.now();
      if (inDanger && isPoorNetwork && now - lastAlertTime.current > ALERT_INTERVAL) {
        setSending(true);
        setError('');
        console.log('[ALERT] Triggered: Preparing to send alert for lat:', position.lat, 'lng:', position.lng);
        const send = () => {
          console.log('[ALERT] Sending alert (background or immediate) for lat:', position.lat, 'lng:', position.lng);
          fetch(`${API_BASE}/alert-location/location`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ latitude: position.lat, longitude: position.lng }),
          })
            .then(res => res.json().then(data => ({ ok: res.ok, data })))
            .then(({ ok, data }) => {
              if (!ok) throw new Error(data.message || 'Failed to send alert');
              setLastSent(Date.now());
              lastAlertTime.current = Date.now();
            })
            .catch(err => setError(err.message))
            .finally(() => setSending(false));
        };
        if ('requestIdleCallback' in window) {
          console.log('[ALERT] Using requestIdleCallback to send alert');
          window.requestIdleCallback(send, { timeout: 60000 }); // 1 minute timeout
        } else {
          console.log('[ALERT] Sending alert immediately (no background API support)');
          send();
        }
      }
    }
    intervalRef.current = setInterval(checkAndMaybeAlert, 20000); // every 20 seconds
    return () => clearInterval(intervalRef.current);
  }, [position, dangerZones, token]);

  // Also expose status for UI
  // Helper: is user in danger zone?
  const inDanger = position && dangerZones && dangerZones.some(zone => {
    const dist = haversine(position.lat, position.lng, zone.latitude, zone.longitude);
    return dist <= zone.radius;
  });
  // Helper: is network 3G or lower or offline?
  const nav = navigator;
  const conn = nav.connection || nav.mozConnection || nav.webkitConnection;
  const isPoorNetwork =
    conn?.effectiveType === '2g' ||
    conn?.effectiveType === 'slow-2g' ||
    conn?.effectiveType === '3g' ||
    conn?.effectiveType === '4g' ||
    conn?.type === 'none';

  return { sending, lastSent, error, inDanger, isPoorNetwork, position };
}
