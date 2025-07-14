import { useEffect, useState } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { haversine } from '../utils/haversine';
import { useAuth } from '../hooks/useAuth';
import { useAlertTrigger } from '../hooks/useAlertTrigger';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function DangerZoneMapPage() {
  const { token } = useAuth();
  const { position, error: geoError } = useGeolocation();
  const network = useNetworkStatus();
  const [dangerZones, setDangerZones] = useState([]);
  const [inDanger, setInDanger] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');

  // Fetch danger zones from backend
  useEffect(() => {
    const fetchZones = async () => {
      setLoading(true);
      setFetchError('');
      try {
        const res = await fetch(`${API_BASE}/danger-zones`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch danger zones');
        setDangerZones(data.dangerZones || []);
      } catch (err) {
        setFetchError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchZones();
  }, [token]);

  // Check if user is in any danger zone
  useEffect(() => {
    if (!position || !dangerZones.length) {
      setInDanger(false);
      return;
    }
    const inside = dangerZones.some(zone => {
      const dist = haversine(position.lat, position.lng, zone.latitude, zone.longitude);
      return dist <= zone.radius;
    });
    setInDanger(inside);
  }, [position, dangerZones]);

  // Use alert trigger hook
  const { sending, lastSent, error: alertError, isPoorNetwork } = useAlertTrigger(dangerZones);

  return (
    <div>
      <h2>Danger Zone Map</h2>
      {geoError && <div style={{ color: 'red' }}>Location error: {geoError}</div>}
      {fetchError && <div style={{ color: 'red' }}>Danger zone error: {fetchError}</div>}
      <div>
        <strong>Your Location:</strong>{' '}
        {position ? `${position.lat.toFixed(5)}, ${position.lng.toFixed(5)}` : 'Locating...'}
      </div>
      <div>
        <strong>Network:</strong> {network.effectiveType} ({network.type})
      </div>
      <div>
        <strong>Status:</strong>{' '}
        {inDanger ? <span style={{ color: 'red' }}>You are in a danger zone!</span> : 'Safe'}
      </div>
      <div>
        <strong>Alert:</strong>{' '}
        {inDanger && isPoorNetwork ? (
          sending ? 'Sending alert...' : lastSent ? `Alert sent at ${new Date(lastSent).toLocaleTimeString()}` : 'Alert will be sent if needed.'
        ) : 'No alert needed.'}
        {alertError && <div style={{ color: 'red' }}>Alert error: {alertError}</div>}
      </div>
      <div style={{ marginTop: 16 }}>
        <strong>Danger Zones:</strong>
        {loading ? (
          <div>Loading zones...</div>
        ) : (
          <ul>
            {dangerZones.map((zone, i) => (
              <li key={i}>
                Lat: {zone.latitude}, Lng: {zone.longitude}, Radius: {zone.radius}m
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
