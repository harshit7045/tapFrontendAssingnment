export default function Notification({ message, type = 'info', onClose }) {
  if (!message) return null;
  const colors = {
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    warning: 'bg-yellow-100 text-yellow-800',
  };
  return (
    <div className={`relative p-4 rounded mb-4 ${colors[type] || colors.info}` }>
      {message}
      {onClose && (
        <button onClick={onClose} className="absolute right-2 top-2 text-lg font-bold text-gray-500 hover:text-gray-800">×</button>
      )}
    </div>
  );
}
