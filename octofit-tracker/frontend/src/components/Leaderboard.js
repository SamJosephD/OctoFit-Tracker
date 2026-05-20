import { useEffect, useState } from 'react';

function Leaderboard({ baseUrl }) {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState(null);
  const endpoint = `${baseUrl}/api/leaderboard/`;

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const response = await fetch(endpoint);
        const data = await response.json();
        console.log('Leaderboard API:', endpoint, data);
        setEntries(data.results || data);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchLeaderboard();
  }, [endpoint]);

  return (
    <div>
      <h2>Leaderboard</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>User</th>
              <th>Team</th>
              <th>Total Activity</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={index}>
                <td>{entry.user}</td>
                <td>{entry.team || 'N/A'}</td>
                <td>{entry.total_activity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Leaderboard;
