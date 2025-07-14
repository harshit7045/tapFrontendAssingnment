import { useRef, useEffect } from 'react';

export default function DangerZoneMap({ userPosition, dangerZones }) {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw danger zones
    dangerZones.forEach(zone => {
      ctx.beginPath();
      ctx.arc(
        canvas.width / 2 + (zone.longitude - (userPosition?.lng || 0)) * 10000,
        canvas.height / 2 - (zone.latitude - (userPosition?.lat || 0)) * 10000,
        zone.radius / 10,
        0,
        2 * Math.PI
      );
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
    // Draw user position
    if (userPosition) {
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 8, 0, 2 * Math.PI);
      ctx.fillStyle = 'blue';
      ctx.fill();
    }
  }, [userPosition, dangerZones]);

  return <canvas ref={canvasRef} width={400} height={400} style={{ border: '1px solid #ccc' }} />;
}
