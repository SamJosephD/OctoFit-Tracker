import { useEffect, useState } from 'react';

function Activities({ baseUrl, auth }) {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);
  const [newActivity, setNewActivity] = useState({ user: '', activity_type: '', duration_minutes: '', distance_km: '' });
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
        body: JSON.stringify(newActivity),
      });
      if (!response.ok) {
        const data = await response.json();
        setError(data.detail || 'Failed to add activity.');
        return;
      }
      const data = await response.json();
      setActivities((prev) => [data, ...prev]);
      setNewActivity({ user: '', activity_type: '', duration_minutes: '', distance_km: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Activities</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {auth?.role === 'admin' && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Add Activity</h5>
            <form onSubmit={handleCreate}>
              <div className="mb-3">
                <label className="form-label">User Email</label>
                <input className="form-control" value={newActivity.user} onChange={(e) => setNewActivity({ ...newActivity, user: e.target.value })} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Activity Type</label>
                <input className="form-control" value={newActivity.activity_type} onChange={(e) => setNewActivity({ ...newActivity, activity_type: e.target.value })} required />
              </div>
              <div className="row">
                <div className="mb-3 col-md-6">
                  <label className="form-label">Duration (minutes)</label>
                  <input className="form-control" value={newActivity.duration_minutes} onChange={(e) => setNewActivity({ ...newActivity, duration_minutes: e.target.value })} type="number" min="1" required />
                </div>
                <div className="mb-3 col-md-6">
                  <label className="form-label">Distance (km)</label>
                  <input className="form-control" value={newActivity.distance_km} onChange={(e) => setNewActivity({ ...newActivity, distance_km: e.target.value })} type="number" min="0" step="0.1" required />
                </div>
              </div>
              <button className="btn btn-success" type="submit">
                Add Activity
              </button>
            </form>
          </div>
        </div>
      )}
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
