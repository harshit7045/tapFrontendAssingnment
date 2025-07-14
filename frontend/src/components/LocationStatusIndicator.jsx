import { useGeolocation } from '../hooks/useGeolocation';

export default function LocationStatusIndicator() {
  const { position, error } = useGeolocation();
  return (
    <div className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">
      <strong>Location:</strong>{' '}
      {error ? <span className="text-red-600">{error}</span> : position ? `${position.lat.toFixed(5)}, ${position.lng.toFixed(5)}` : 'Locating...'}
    </div>
  );
}
