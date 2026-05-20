import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ baseUrl, onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await fetch(`${baseUrl}/api/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.detail || 'Login failed.');
        return;
      }

      const data = await response.json();
      onLogin({ token: data.token, user: data.user, role: data.user.role });
      navigate('/users');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        </div>
        <button className="btn btn-primary" type="submit">
          Sign In
        </button>
      </form>
    </div>
  );
}

export default Login;
