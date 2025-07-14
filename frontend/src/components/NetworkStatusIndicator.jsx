import { useNetworkStatus } from '../hooks/useNetworkStatus';

export default function NetworkStatusIndicator() {
  const { effectiveType, type } = useNetworkStatus();
  return (
    <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
      <strong>Network:</strong> {effectiveType} ({type})
    </div>
  );
}
