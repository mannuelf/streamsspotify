import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { getAccessToken } from '../utils/spotifyApi';

export const Route = createFileRoute('/callback')({
  component: Callback,
});

function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get('code');
    if (code) {
      getAccessToken(code)
        .then((token) => {
          localStorage.setItem('spotify_access_token', token);
          navigate({ to: '/' });
        })
        .catch((err) => {
          console.error('Auth failed', err);
          navigate({ to: '/' });
        });
    } else {
      navigate({ to: '/' });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass-panel p-8 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-spotify-green border-t-transparent rounded-full animate-spin mx-auto" />
        <h2 className="text-xl font-bold">Authenticating...</h2>
        <p className="text-text-secondary text-sm">Connecting to Spotify</p>
      </div>
    </div>
  );
}
