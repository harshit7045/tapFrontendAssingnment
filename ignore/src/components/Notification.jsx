export default function Notification({ message, type = 'info', onClose }) {
  if (!message) return null;
  const colors = {
    success: '#d4edda',
    error: '#f8d7da',
    info: '#d1ecf1',
    warning: '#fff3cd',
  };
  return (
    <div style={{
      background: colors[type] || colors.info,
      color: '#333',
      padding: '1em',
      borderRadius: 4,
      margin: '1em 0',
      position: 'relative',
    }}>
      {message}
      {onClose && (
        <button onClick={onClose} style={{ position: 'absolute', right: 8, top: 8 }}>×</button>
      )}
    </div>
  );
}
