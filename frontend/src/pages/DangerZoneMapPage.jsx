import { useEffect, useState } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { haversine } from '../utils/haversine';
import { useAuth } from '../hooks/useAuth';
import { useAlertTrigger } from '../hooks/useAlertTrigger';
import { apiFetch } from '../utils/apiFetch';

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
        const res = await apiFetch(`${API_BASE}/danger-zones`, {
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
  //console.log(dangerZones);

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Danger Zone Map</h2>
      {geoError && <div className="mb-4 text-red-600 text-center">Location error: {geoError}</div>}
      {fetchError && <div className="mb-4 text-red-600 text-center">Danger zone error: {fetchError}</div>}
      <div className="mb-2">
        <strong>Your Location:</strong>{' '}
        {position ? `${position.lat.toFixed(5)}, ${position.lng.toFixed(5)}` : 'Locating...'}
      </div>
      <div className="mb-2">
        <strong>Network:</strong> {network.effectiveType} ({network.type})
      </div>
      <div className="mb-2">
        <strong>Status:</strong>{' '}
        {inDanger ? <span className="text-red-600 font-semibold">You are in a danger zone!</span> : <span className="text-green-600 font-semibold">Safe</span>}
      </div>
      <div className="mb-2">
        <strong>Alert:</strong>{' '}
        {inDanger && isPoorNetwork ? (
          sending ? 'Sending alert...' : lastSent ? `Alert sent at ${new Date(lastSent).toLocaleTimeString()}` : 'Alert will be sent if needed.'
        ) : 'No alert needed.'}
        {alertError && <div className="text-red-600">Alert error: {alertError}</div>}
      </div>
      <div className="mt-6">
        <strong>Danger Zones:</strong>
        {loading ? (
          <div className="text-blue-600">Loading zones...</div>
        ) : (
          <ul className="list-none space-y-2 mt-2">
            {dangerZones.map((zone, i) => (
              <li key={i} className="bg-gray-100 rounded px-3 py-2">
                Lat: {zone.latitude}, Lng: {zone.longitude}, Radius: {zone.radius}m
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
