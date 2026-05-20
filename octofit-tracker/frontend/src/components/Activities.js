import { useEffect, useState } from 'react';

function Activities({ baseUrl }) {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);
  const endpoint = `${baseUrl}/api/activities/`;

  useEffect(() => {
    async function fetchActivities() {
      try {
        const response = await fetch(endpoint);
        const data = await response.json();
        console.log('Activities API:', endpoint, data);
        setActivities(data.results || data);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchActivities();
  }, [endpoint]);

  return (
    <div>
      <h2>Activities</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>User</th>
              <th>Type</th>
              <th>Duration</th>
              <th>Distance</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity.id}>
                <td>{activity.user}</td>
                <td>{activity.activity_type}</td>
                <td>{activity.duration_minutes} min</td>
                <td>{activity.distance_km} km</td>
                <td>{new Date(activity.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Activities;
