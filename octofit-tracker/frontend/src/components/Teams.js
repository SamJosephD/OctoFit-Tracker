import { useEffect, useState } from 'react';

function Teams({ baseUrl, auth }) {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);
  const [newTeam, setNewTeam] = useState({ name: '', description: '' });
  const endpoint = `${baseUrl}/api/teams/`;

  useEffect(() => {
    async function fetchTeams() {
      try {
        const response = await fetch(endpoint);
        const data = await response.json();
        console.log('Teams API:', endpoint, data);
        setTeams(data.results || data);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchTeams();
  }, [endpoint]);

  const handleCreate = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: auth?.token ? `Token ${auth.token}` : undefined,
        },
        body: JSON.stringify(newTeam),
      });
      if (!response.ok) {
        const data = await response.json();
        setError(data.detail || 'Failed to add team.');
        return;
      }
      const data = await response.json();
      setTeams((prev) => [data, ...prev]);
      setNewTeam({ name: '', description: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Teams</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {auth?.role === 'admin' && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Add New Team</h5>
            <form onSubmit={handleCreate}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input className="form-control" value={newTeam.name} onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea className="form-control" value={newTeam.description} onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })} rows="3" />
              </div>
              <button className="btn btn-success" type="submit">
                Add Team
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
              <th>Description</th>
              <th>Score</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr key={team.id}>
                <td>{team.name}</td>
                <td>{team.description}</td>
                <td>{team.leaderboard_score}</td>
                <td>{new Date(team.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Teams;
