import { useEffect, useState } from 'react';

function Workouts({ baseUrl }) {
  const [workouts, setWorkouts] = useState([]);
  const [error, setError] = useState(null);
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

  return (
    <div>
      <h2>Workouts</h2>
      {error && <div className="alert alert-danger">{error}</div>}
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
