import { useEffect, useState } from 'react';

function Users({ baseUrl }) {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
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

  return (
    <div>
      <h2>Users</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Team</th>
              <th>Joined At</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
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
