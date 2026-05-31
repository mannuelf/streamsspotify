import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { getTopTracks, getTopArtists, getRecentlyPlayed, calculateTopGenres } from '../utils/spotifyApi';
import type { TimeRange } from '../utils/spotifyApi';
import { TrendingUp, Music, User as UserIcon, Clock } from 'lucide-react';

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>('medium_term');

  const { data: topTracks, isLoading: tracksLoading } = useQuery({
    queryKey: ['topTracks', timeRange],
    queryFn: () => getTopTracks(timeRange, 20),
  });

  const { data: topArtists, isLoading: artistsLoading } = useQuery({
    queryKey: ['topArtists', timeRange],
    queryFn: () => getTopArtists(timeRange, 20),
  });

  const { data: recentlyPlayed, isLoading: recentLoading } = useQuery({
    queryKey: ['recentlyPlayed'],
    queryFn: () => getRecentlyPlayed(20),
  });

  const topGenres = topArtists ? calculateTopGenres(topArtists.items) : [];

  const timeRangeOptions: { label: string; value: TimeRange }[] = [
    { label: '4 Weeks', value: 'short_term' },
    { label: '6 Months', value: 'medium_term' },
    { label: 'All Time', value: 'long_term' },
  ];

  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto space-y-12 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold display-title mb-2">
            Your Soundscape
          </h1>
          <p className="text-text-secondary">Explore your most played tracks and artists.</p>
        </div>

        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 backdrop-blur-sm self-start">
          {timeRangeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTimeRange(opt.value)}
              className={
                'px-4 py-2 rounded-lg text-sm font-medium transition-all ' +
                (timeRange === opt.value 
                  ? 'bg-spotify-green text-black shadow-lg shadow-spotify-green/20' 
                  : 'hover:bg-white/5 text-text-secondary')
              }
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Music className="text-spotify-green w-5 h-5" />
            <h2 className="text-xl font-bold">Top Tracks</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tracksLoading ? (
              [0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="glass-panel p-3 h-20 animate-pulse bg-white/5" />
              ))
            ) : (
              topTracks?.items.map((track: any, index: number) => (
                <div key={track.id} className="glass-panel p-3 flex items-center gap-4 group hover:border-spotify-green/50 transition-all">
                  <img src={track.album.images?.[0]?.url} alt={track.name} className="w-14 h-14 rounded-md object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm truncate">{track.name}</h4>
                    <p className="text-xs text-text-secondary truncate">{track.artists.map((a: any) => a.name).join(', ')}</p>
                  </div>
                  <span className="text-white/20 font-display font-black text-2xl italic pr-2">{index + 1}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-spotify-green w-5 h-5" />
            <h2 className="text-xl font-bold">Top Genres</h2>
          </div>
          <div className="glass-panel p-6 space-y-4">
            {topGenres.map((genre: any) => (
              <div key={genre.name} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="capitalize">{genre.name}</span>
                  <span className="text-text-secondary">{genre.count}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-spotify-green neon-glow" 
                    style={{ width: (genre.count / 10 * 100) + '%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <UserIcon className="text-spotify-green w-5 h-5" />
            <h2 className="text-xl font-bold">Top Artists</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {artistsLoading ? (
              [0, 1, 2, 3].map((i) => (
                <div key={i} className="glass-panel aspect-square animate-pulse bg-white/5" />
              ))
            ) : (
              topArtists?.items.slice(0, 8).map((artist: any) => (
                <div key={artist.id} className="glass-panel p-4 flex flex-col items-center text-center gap-3 hover:border-spotify-green/50 transition-all">
                  <img src={artist.images?.[0]?.url} alt={artist.name} className="w-20 h-20 rounded-full object-cover border-2 border-white/5" />
                  <span className="text-xs font-bold truncate w-full">{artist.name}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="text-spotify-green w-5 h-5" />
            <h2 className="text-xl font-bold">Recently Played</h2>
          </div>
          <div className="space-y-3">
            {recentLoading ? (
              [0, 1, 2].map((i) => (
                <div key={i} className="glass-panel p-3 h-16 animate-pulse bg-white/5" />
              ))
            ) : (
              recentlyPlayed?.items.slice(0, 5).map((item: any) => (
                <div key={item.played_at} className="glass-panel p-3 flex items-center gap-3">
                  <img src={item.track.album.images?.[0]?.url} className="w-10 h-10 rounded object-cover" alt="" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold truncate">{item.track.name}</h4>
                    <p className="text-[10px] text-text-secondary truncate">{item.track.artists[0].name}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
