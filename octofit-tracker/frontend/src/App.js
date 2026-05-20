import { useEffect, useState } from 'react';
import { NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  const navigate = useNavigate();
  const [auth, setAuth] = useState({ token: null, user: null, role: null });

  useEffect(() => {
    const stored = localStorage.getItem('octofitAuth');
    if (stored) {
      setAuth(JSON.parse(stored));
    }
  }, []);

  const saveAuth = (data) => {
    localStorage.setItem('octofitAuth', JSON.stringify(data));
    setAuth(data);
  };

  const clearAuth = () => {
    localStorage.removeItem('octofitAuth');
    setAuth({ token: null, user: null, role: null });
    navigate('/login');
  };

  const getBackendBaseUrl = () => {
    if (process.env.REACT_APP_BACKEND_URL) {
      return process.env.REACT_APP_BACKEND_URL;
    }

    const host = typeof window !== 'undefined' ? window.location.hostname : '';
    const codespaceMatch = host.match(/^(.+)-\d+\.app\.github\.dev$/);
    const codespaceName = process.env.REACT_APP_CODESPACE_NAME || (codespaceMatch && codespaceMatch[1]);

    if (codespaceName) {
      return `https://${codespaceName}-8000.app.github.dev`;
    }

    if (host && host.includes('.app.github.dev') && codespaceMatch) {
      return `https://${codespaceMatch[1]}-8000.app.github.dev`;
    }

    return 'http://localhost:8000';
  };

  const baseUrl = getBackendBaseUrl();

  return (
    <div className="container py-4">
      <header className="mb-4">
        <h1 className="display-5">OctoFit Tracker</h1>
        <p className="lead">Fitness goals, teams, leaderboard, and workouts in one place.</p>
        {auth.user && (
          <div className="alert alert-success py-2">
            Signed in as <strong>{auth.user.name}</strong> ({auth.user.role})
          </div>
        )}
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
          {!auth.token ? (
            <>
              <li className="nav-item">
                <NavLink className="nav-link" to="/login">
                  Sign In
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/signup">
                  Sign Up
                </NavLink>
              </li>
            </>
          ) : (
            <li className="nav-item">
              <button className="btn btn-outline-light btn-sm nav-link" onClick={clearAuth}>
                Sign Out
              </button>
            </li>
          )}
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Users baseUrl={baseUrl} auth={auth} />} />
        <Route path="/users" element={<Users baseUrl={baseUrl} auth={auth} />} />
        <Route path="/teams" element={<Teams baseUrl={baseUrl} auth={auth} />} />
        <Route path="/activities" element={<Activities baseUrl={baseUrl} auth={auth} />} />
        <Route path="/workouts" element={<Workouts baseUrl={baseUrl} auth={auth} />} />
        <Route path="/leaderboard" element={<Leaderboard baseUrl={baseUrl} />} />
        <Route path="/login" element={<Login baseUrl={baseUrl} onLogin={saveAuth} />} />
        <Route path="/signup" element={<Signup baseUrl={baseUrl} onSignup={saveAuth} />} />
      </Routes>
    </div>
  );
}

export default App;
