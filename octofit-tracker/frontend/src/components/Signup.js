import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup({ baseUrl, onSignup }) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await fetch(`${baseUrl}/api/auth/signup/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, bio }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.detail || 'Signup failed.');
        return;
      }

      const data = await response.json();
      onSignup({ token: data.token, user: data.user, role: data.user.role });
      navigate('/users');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Bio</label>
          <textarea className="form-control" value={bio} onChange={(e) => setBio(e.target.value)} rows="3" />
        </div>
        <button className="btn btn-primary" type="submit">
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default Signup;
