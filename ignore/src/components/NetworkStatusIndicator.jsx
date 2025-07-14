import { useNetworkStatus } from '../hooks/useNetworkStatus';

export default function NetworkStatusIndicator() {
  const { effectiveType, type } = useNetworkStatus();
  return (
    <div>
      <strong>Network:</strong> {effectiveType} ({type})
    </div>
  );
}
