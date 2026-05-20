import { useEffect, useState } from 'react';

function Teams({ baseUrl }) {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);
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

  return (
    <div>
      <h2>Teams</h2>
      {error && <div className="alert alert-danger">{error}</div>}
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
