import { useState, useEffect } from 'react';

export function useNetworkStatus() {
  const getConnection = () => {
    const nav = navigator;
    const conn = nav.connection || nav.mozConnection || nav.webkitConnection;
    if (!conn) return { type: 'unknown', effectiveType: 'unknown', downlink: null };
    return {
      type: conn.type || 'unknown',
      effectiveType: conn.effectiveType || 'unknown',
      downlink: conn.downlink || null
    };
  };

  const [status, setStatus] = useState(getConnection());

  useEffect(() => {
    const nav = navigator;
    const conn = nav.connection || nav.mozConnection || nav.webkitConnection;
    if (!conn) return;
    const update = () => setStatus(getConnection());
    conn.addEventListener('change', update);
    return () => conn.removeEventListener('change', update);
  }, []);

  return status;
}
