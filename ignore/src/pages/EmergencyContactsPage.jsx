import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function EmergencyContactsPage() {
  const { token } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch contacts on mount
  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_BASE}/contacts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch contacts');
        setContacts(data.contacts || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, [token]);

  // Add contact
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newContact) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: newContact }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add contact');
      setContacts(data.contacts || []);
      setNewContact('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Remove contact
  const handleRemove = async (email) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/contacts`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to remove contact');
      setContacts(data.contacts || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Emergency Contacts</h2>
      <form onSubmit={handleAdd} style={{ marginBottom: '1rem' }}>
        <input
          type="email"
          placeholder="Add contact email"
          value={newContact}
          onChange={e => setNewContact(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>Add</button>
      </form>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <ul>
        {contacts.map(email => (
          <li key={email}>
            {email}
            <button onClick={() => handleRemove(email)} disabled={loading} style={{ marginLeft: 8 }}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      {contacts.length === 0 && !loading && <div>No emergency contacts yet.</div>}
    </div>
  );
}
