import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { apiFetch } from '../utils/apiFetch';

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
        const res = await apiFetch(`${API_BASE}/contacts`, {
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
      const res = await apiFetch(`${API_BASE}/contacts`, {
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
      const res = await apiFetch(`${API_BASE}/contacts`, {
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
    <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Emergency Contacts</h2>
      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input
          type="email"
          placeholder="Add contact email"
          value={newContact}
          onChange={e => setNewContact(e.target.value)}
          required
          className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition"
        >
          Add
        </button>
      </form>
      {loading && <div className="mb-4 text-blue-600 text-center">Loading...</div>}
      {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
      <ul className="space-y-3 list-none">
        {contacts.map(email => (
          <li key={email} className="flex items-center justify-between bg-gray-100 rounded px-3 py-2">
            <span>{email}</span>
            <button
              onClick={() => handleRemove(email)}
              disabled={loading}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      {contacts.length === 0 && !loading && <div className="text-gray-500 text-center mt-4">No emergency contacts yet.</div>}
    </div>
  );
}
