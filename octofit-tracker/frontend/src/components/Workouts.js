import { useEffect, useState } from 'react';

function Workouts({ baseUrl, auth }) {
  const [workouts, setWorkouts] = useState([]);
  const [error, setError] = useState(null);
  const [newWorkout, setNewWorkout] = useState({ user: '', title: '', description: '', scheduled_for: '' });
  const endpoint = `${baseUrl}/api/workouts/`;

  useEffect(() => {
    async function fetchWorkouts() {
      try {
        const response = await fetch(endpoint);
        const data = await response.json();
        console.log('Workouts API:', endpoint, data);
        setWorkouts(data.results || data);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchWorkouts();
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
        body: JSON.stringify(newWorkout),
      });
      if (!response.ok) {
        const data = await response.json();
        setError(data.detail || 'Failed to add workout.');
        return;
      }
      const data = await response.json();
      setWorkouts((prev) => [data, ...prev]);
      setNewWorkout({ user: '', title: '', description: '', scheduled_for: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Workouts</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {auth?.role === 'admin' && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Add Workout</h5>
            <form onSubmit={handleCreate}>
              <div className="mb-3">
                <label className="form-label">User Email</label>
                <input className="form-control" value={newWorkout.user} onChange={(e) => setNewWorkout({ ...newWorkout, user: e.target.value })} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input className="form-control" value={newWorkout.title} onChange={(e) => setNewWorkout({ ...newWorkout, title: e.target.value })} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea className="form-control" value={newWorkout.description} onChange={(e) => setNewWorkout({ ...newWorkout, description: e.target.value })} rows="3" />
              </div>
              <div className="mb-3">
                <label className="form-label">Scheduled For</label>
                <input className="form-control" value={newWorkout.scheduled_for} onChange={(e) => setNewWorkout({ ...newWorkout, scheduled_for: e.target.value })} type="datetime-local" required />
              </div>
              <button className="btn btn-success" type="submit">
                Add Workout
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
              <th>Title</th>
              <th>Description</th>
              <th>Scheduled</th>
              <th>Completed</th>
            </tr>
          </thead>
          <tbody>
            {workouts.map((workout) => (
              <tr key={workout.id}>
                <td>{workout.user}</td>
                <td>{workout.title}</td>
                <td>{workout.description}</td>
                <td>{new Date(workout.scheduled_for).toLocaleString()}</td>
                <td>{workout.completed ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Workouts;
