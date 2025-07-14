import { useGeolocation } from '../hooks/useGeolocation';

export default function LocationStatusIndicator() {
  const { position, error } = useGeolocation();
  return (
    <div>
      <strong>Location:</strong>{' '}
      {error ? <span style={{ color: 'red' }}>{error}</span> : position ? `${position.lat.toFixed(5)}, ${position.lng.toFixed(5)}` : 'Locating...'}
    </div>
  );
}
