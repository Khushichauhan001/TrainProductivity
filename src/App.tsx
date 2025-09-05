import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { apiService } from './services/api';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Check for existing token
    const token = localStorage.getItem('token');
    if (token) {
      apiService.setToken(token);
      // In a real app, you'd validate the token with the server
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = async (credentials: { username: string; password: string }) => {
    try {
      setError('');
      
      // Try login first
      let response;
      try {
        response = await apiService.login(credentials.username, credentials.password);
      } catch (loginError) {
        // If login fails, try to register the user
        if (loginError instanceof Error && loginError.message.includes('Invalid credentials')) {
          try {
            response = await apiService.register(credentials.username, credentials.password);
          } catch (registerError) {
            throw loginError; // Throw original login error if register also fails
          }
        } else {
          throw loginError;
        }
      }
      
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    }
  };

  const handleLogout = () => {
    apiService.removeToken();
    localStorage.removeItem('user');
    setUser(null);
    setError('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} error={error} />;
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
}

export default App;