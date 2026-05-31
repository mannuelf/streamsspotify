import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { redirectToAuthCodeFlow } from '../utils/spotifyApi';
import Dashboard from '../components/Dashboard';
import { Search } from 'lucide-react';

export const Route = createFileRoute('/')({ component: App });

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('spotify_access_token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleLogin = (e: any) => {
    e.preventDefault();
    if (!username.trim()) return;
    localStorage.setItem('target_username', username);
    redirectToAuthCodeFlow();
  };

  if (!token) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="glass-panel p-10 max-w-lg w-full text-center space-y-8 animate-fade-in">
          <div className="space-y-4">
            <h1 className="text-5xl font-display font-black display-title">
              Streams<span className="text-spotify-green">Spotify</span>
            </h1>
            <p className="text-text-secondary text-lg">
              Enter username to see top tracks, artists, genres, and more.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5" />
              <input 
                type="text" 
                placeholder="Spotify Username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-12 pr-6 outline-none focus:border-spotify-green transition-colors"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-spotify-green text-black font-black py-4 rounded-full text-lg shadow-xl shadow-spotify-green/20 hover:scale-105 transition-transform"
            >
              View Stats
            </button>
          </form>

          <p className="text-xs text-text-secondary">
            Connect Spotify account to authorize access.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <Dashboard />
    </main>
  );
}
