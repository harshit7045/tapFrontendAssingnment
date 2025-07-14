export default function ContactList({ contacts, onRemove }) {
  if (!contacts || contacts.length === 0) return <div>No contacts.</div>;
  return (
    <ul>
      {contacts.map(email => (
        <li key={email}>
          {email}
          {onRemove && (
            <button onClick={() => onRemove(email)} style={{ marginLeft: 8 }}>Remove</button>
          )}
        </li>
      ))}
    </ul>
  );
}
