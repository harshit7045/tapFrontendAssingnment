import { useEffect, useRef, useState } from 'react';
import { useGeolocation } from './useGeolocation';
import { useNetworkStatus } from './useNetworkStatus';
import { haversine } from '../utils/haversine';
import { useAuth } from './useAuth';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const ALERT_INTERVAL = 5 * 60 * 1000; // 5 minutes

export function useAlertTrigger(dangerZones) {
  const { token } = useAuth();
  const { position } = useGeolocation();
  const network = useNetworkStatus();
  const [lastSent, setLastSent] = useState(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const intervalRef = useRef();

  // Helper: is user in danger zone?
  const inDanger = position && dangerZones && dangerZones.some(zone => {
    const dist = haversine(position.lat, position.lng, zone.latitude, zone.longitude);
    return dist <= zone.radius;
  });

  // Helper: is network poor or offline?
  const isPoorNetwork = network.effectiveType === '2g' || network.effectiveType === 'slow-2g' || network.type === 'none';

  // Send alert to backend
  const sendAlert = async () => {
    if (!inDanger || !isPoorNetwork || !position || !token) return;
    setSending(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/alert-location`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ latitude: position.lat, longitude: position.lng }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to send alert');
      }
      setLastSent(Date.now());
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  // Background Tasks API or setInterval fallback
  useEffect(() => {
    if (!inDanger || !isPoorNetwork) return;
    // Try Background Tasks API
    if ('background' in navigator && navigator.background && navigator.background.setPeriodicSync) {
      // Not widely supported yet
      // Example usage (pseudo):
      // navigator.background.setPeriodicSync('send-alert', { minInterval: ALERT_INTERVAL });
      // But fallback for now
    }
    // Fallback: setInterval
    if (intervalRef.current) clearInterval(intervalRef.current);
    sendAlert(); // Send immediately
    intervalRef.current = setInterval(sendAlert, ALERT_INTERVAL);
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line
  }, [inDanger, isPoorNetwork, position, token]);

  return { sending, lastSent, error, inDanger, isPoorNetwork };
}
