import { Link } from '@tanstack/react-router';
import { Music, LogOut, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getProfile } from '../utils/spotifyApi';

export default function Navbar() {
  const [profile, setProfile] = useState<any>(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('spotify_access_token') : null;

  useEffect(() => {
    if (token) {
      getProfile().then(setProfile).catch(console.error);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('spotify_access_token');
    window.location.href = '/';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
      <div className="max-w-7xl mx-auto glass-panel px-6 py-2 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-spotify-green p-1.5 rounded-lg neon-glow group-hover:scale-110 transition-transform">
            <Music className="w-5 h-5 text-black" />
          </div>
          <span className="text-xl font-display font-extrabold tracking-tight">
            Vibe<span className="text-spotify-green">Stats</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {token ? (
            <>
              <div className="hidden md:flex items-center gap-6 mr-4">
                <Link to="/" className="text-sm font-medium hover:text-spotify-green transition-colors">Dashboard</Link>
                <Link to="/about" className="text-sm font-medium hover:text-spotify-green transition-colors">About</Link>
              </div>
              
              <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                {profile ? (
                  <div className="flex items-center gap-2">
                    <img 
                      src={profile.images?.[0]?.url} 
                      alt={profile.display_name} 
                      className="w-8 h-8 rounded-full border border-spotify-green/50"
                    />
                    <span className="hidden sm:inline text-sm font-medium">{profile.display_name}</span>
                  </div>
                ) : (
                  <User className="w-5 h-5 text-text-secondary" />
                )}
                
                <button 
                  onClick={handleLogout}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors text-text-secondary hover:text-white"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <Link to="/about" className="text-sm font-medium hover:text-spotify-green transition-colors">About</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
