import { useEffect, useState } from 'react';

function Users({ baseUrl, auth }) {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', bio: '' });
  const endpoint = `${baseUrl}/api/users/`;

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch(endpoint);
        const data = await response.json();
        console.log('Users API:', endpoint, data);
        setUsers(data.results || data);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchUsers();
  }, [endpoint]);

  const handleNewUserSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await fetch(`${baseUrl}/api/auth/signup/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: auth?.token ? `Token ${auth.token}` : undefined,
        },
        body: JSON.stringify(newUser),
      });
      if (!response.ok) {
        const data = await response.json();
        setError(data.detail || 'Failed to add user.');
        return;
      }
      setNewUser({ name: '', email: '', password: '', bio: '' });
      const data = await response.json();
      setUsers((prev) => [{ ...data.user, team: 'No team', joined_at: new Date().toISOString() }, ...prev]);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Users</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {auth?.role === 'admin' && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Add New User</h5>
            <form onSubmit={handleNewUserSubmit}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input className="form-control" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input className="form-control" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} type="email" required />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input className="form-control" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} type="password" required />
              </div>
              <div className="mb-3">
                <label className="form-label">Bio</label>
                <textarea className="form-control" value={newUser.bio} onChange={(e) => setNewUser({ ...newUser, bio: e.target.value })} rows="2" />
              </div>
              <button className="btn btn-success" type="submit">
                Add User
              </button>
            </form>
          </div>
        </div>
      )}
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Team</th>
              <th>Joined At</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role || 'user'}</td>
                <td>{user.team || 'No team'}</td>
                <td>{new Date(user.joined_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Users;
