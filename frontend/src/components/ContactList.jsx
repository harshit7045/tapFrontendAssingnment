export default function ContactList({ contacts, onRemove }) {
  if (!contacts || contacts.length === 0) return <div className="text-gray-500">No contacts.</div>;
  return (
    <ul className="space-y-3 list-none">
      {contacts.map(email => (
        <li key={email} className="flex items-center justify-between bg-gray-100 rounded px-3 py-2">
          <span>{email}</span>
          {onRemove && (
            <button
              onClick={() => onRemove(email)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
            >
              Remove
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
