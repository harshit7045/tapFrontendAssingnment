import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function RegistrationPage() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [contacts, setContacts] = useState('');
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const contactsArr = contacts.split(',').map(c => c.trim()).filter(Boolean);
    const success = await register(name, password, contactsArr);
    if (success) navigate('/');
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <div>
          <label>Initial Emergency Contacts (comma-separated emails):</label>
          <input value={contacts} onChange={e => setContacts(e.target.value)} />
        </div>
        <button type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
      </form>
      {error && <div style={{color: 'red'}}>{error}</div>}
    </div>
  );
}
