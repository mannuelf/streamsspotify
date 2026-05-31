# Implementation Plan - Spotify Stats & sharing App ("streamsspotify")

Premium alternative to statsforspotify.com with advanced visualizations, built-in preview player, customizable graphic sharing cards, and zero-database instant public sharing.

## User Review Required

> [!IMPORTANT]
> **No-Database Sharing Architecture**: To allow sharing without complex, expensive backends or database hosting, we will compress the user's top stats (tracks, artists, genres) using **LZ-String (LZW compression)** and encode them directly into the shareable URL's hash. 
> - Anyone opening the shareable URL (e.g., `https://streamsspotify.vercel.app/share#data=eJz...`) will load the beautiful profile cards instantly without logging in.
> - **Benefits**: 100% free hosting, infinite scale, absolute privacy (no personal tokens stored on servers), and instant load.
> - **Alternative**: We could use a Supabase database if you prefer persistent server-side URLs (like `streamsspotify.app/user/username`), which requires database setup. URL-based compression is recommended for speed and ease of deployment.

> [!TIP]
> **UI Style**: Modern Glassmorphic Dark Mode with glowing neon Spotify-green (`#1DB954`) and deep space purple gradients, interactive hover states, micro-animations, and integrated Google Fonts (Outfit & Inter).

---

## Proposed Subdirectory
We will create a new directory for this project at:
`/Users/mannuelferreira/workspace/streamsspotify`

You should set this directory as your active workspace once approved.

---

## Proposed Changes

### Component 1: Core App & Build Setup

#### [NEW] [package.json](file:///Users/mannuelferreira/workspace/streamsspotify/package.json)
Initialize standard React 19 + TypeScript + Vite project configuration. Includes:
- **`@tanstack/react-query`** for robust fetching, automatic caching, caching invalidation on time range switch, and error state handling.
- `lz-string` (compression) and `html-to-image` (share card PNG export).

#### [NEW] [vite.config.ts](file:///Users/mannuelferreira/workspace/streamsspotify/vite.config.ts)
Configure Vite with asset paths.

#### [NEW] [index.html](file:///Users/mannuelferreira/workspace/streamsspotify/index.html)
Add premium fonts (Outfit, Inter) and set up viewport, meta tags for SEO.

---

### Component 2: CSS Styling & Theme Design System

#### [NEW] [index.css](file:///Users/mannuelferreira/workspace/streamsspotify/src/index.css)
Establish the styling foundations using vanilla CSS custom properties:
- Custom dark-mode colors: depth/glass gradients, glows, Spotify green.
- Glassmorphism utility classes (`.glass-panel`, `.glass-button`).
- Premium animations (fade-in, slide-up, card hover transforms, rotating vinyl disc, audio equalizer bars).
- Responsive grid and layout frameworks.

---

### Component 3: Spotify API and Auth Integration

#### [NEW] [spotifyApi.ts](file:///Users/mannuelferreira/workspace/streamsspotify/src/utils/spotifyApi.ts)
- **OAuth PKCE flow logic**: client-side token acquisition and refresh without a backend secret.
- **API Fetch wrappers**:
  - `getTopTracks(timeRange, limit)`
  - `getTopArtists(timeRange, limit)`
  - `getRecentlyPlayed(limit)`
  - Automatic error and rate-limit handling.
- **Top Genres calculator**: Extrapolate and count occurrences of genres returned by top artists to build a user's top genres list.

---

### Component 4: Sharing & Poster Card Utility

#### [NEW] [sharing.ts](file:///Users/mannuelferreira/workspace/streamsspotify/src/utils/sharing.ts)
- Compression utility using LZ-String to compress statistical payload (top artists, tracks) into highly dense, URL-safe base64 strings.
- Share link generator and parser.

---

### Component 5: Components & Views

#### [NEW] [Navbar.tsx](file:///Users/mannuelferreira/workspace/streamsspotify/src/components/Navbar.tsx)
Responsive navigation with Glassmorphism, login status, profile avatar, and "Share Profile" trigger.

#### [NEW] [Dashboard.tsx](file:///Users/mannuelferreira/workspace/streamsspotify/src/components/Dashboard.tsx)
The main authenticated screen:
- Time range state linked to TanStack Query keys (`['topTracks', timeRange]`, `['topArtists', timeRange]`).
- **TanStack Query hooks**: Handles seamless cache management and loading indicators during queries.
- **Top Tracks Grid**: Dynamic list showing album art, name, artist name, and a floating play button.
- **Top Artists Grid**: Profile-card styling with popularity indicators.
- **Top Genres Chart**: Glowing percentage bar indicators representing computed genre breakdown.
- **Recently Played**: Chronological listening history list with relative timing.

#### [NEW] [PreviewPlayer.tsx](file:///Users/mannuelferreira/workspace/streamsspotify/src/components/PreviewPlayer.tsx)
Floating, audio element-based playback controller that:
- Plays the 30-second preview URL from the track payload.
- Shows smooth custom equalizer micro-animations.
- Controls: Play/Pause, track details (art/title), volume, progress slider.

#### [NEW] [ShareCardGenerator.tsx](file:///Users/mannuelferreira/workspace/streamsspotify/src/components/ShareCardGenerator.tsx)
Poster design canvas enabling:
- Custom format select: Instagram Story (9:16) or Square Card (1:1).
- Card layouts: Top 5 Tracks poster vs Top 5 Artists poster.
- Theme presets: Retro Neon, Midnight Glass, Sunset Glow, Classic Spotify Dark.
- High-quality export as PNG image using `html-to-image` for instant social sharing.

#### [NEW] [SharedProfile.tsx](file:///Users/mannuelferreira/workspace/streamsspotify/src/components/SharedProfile.tsx)
Static public view loaded when someone lands on a compressed URL. Restores stats from the hash payload and displays the layout without needing Spotify authentication.

---

## Verification Plan

### Automated / Command-Line Checks
- `npm run build` to verify production-ready bundle size and TypeScript compiler correctness.
- Code linting via ESLint configured within Vite.

### Manual Verification
1. **OAuth Verification**: Complete login redirect and PKCE token storage.
2. **Dashboard Verification**: Check track, artist, genre data loading across all 3 time ranges.
3. **Player Verification**: Test playing 30s preview audio track transitions.
4. **Share Card Verification**: Verify customization options and trigger downloading a high-res PNG.
5. **URL Sharing Verification**: Generate a share link, open it in an Incognito/Private browser tab, and verify that the exact profile dashboard matches without logging in.

## Deployment Plan
- **Platform**: Cloudflare Pages (ideal for static Vite React SPA).
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Deployment Tool**: Wrangler CLI (`npx wrangler pages deploy dist` or link to GitHub repository for automated Cloudflare Pages builds).
