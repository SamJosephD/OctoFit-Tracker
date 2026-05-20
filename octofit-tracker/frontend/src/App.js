import { NavLink, Route, Routes } from 'react-router-dom';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

function App() {
  const baseUrl = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
    : 'http://localhost:8000';

  return (
    <div className="container py-4">
      <header className="mb-4">
        <h1 className="display-5">OctoFit Tracker</h1>
        <p className="lead">Fitness goals, teams, leaderboard, and workouts in one place.</p>
      </header>

      <nav className="mb-4">
        <ul className="nav nav-pills flex-column flex-sm-row gap-2">
          <li className="nav-item">
            <NavLink className="nav-link" to="/users">
              Users
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/teams">
              Teams
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/activities">
              Activities
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/workouts">
              Workouts
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/leaderboard">
              Leaderboard
            </NavLink>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Users baseUrl={baseUrl} />} />
        <Route path="/users" element={<Users baseUrl={baseUrl} />} />
        <Route path="/teams" element={<Teams baseUrl={baseUrl} />} />
        <Route path="/activities" element={<Activities baseUrl={baseUrl} />} />
        <Route path="/workouts" element={<Workouts baseUrl={baseUrl} />} />
        <Route path="/leaderboard" element={<Leaderboard baseUrl={baseUrl} />} />
      </Routes>
    </div>
  );
}

export default App;
