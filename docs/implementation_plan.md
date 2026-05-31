# Implementation Plan - Spotify Stats App ("streamsspotify")

Simplified Spotify statistics viewer focusing on data visualization and instant sharing.

## User Review Required

> [!IMPORTANT]
> **Data Privacy & API Limitations**: Spotify API does not allow fetching "Top Tracks" or "Recently Played" for arbitrary usernames due to privacy.
>
> - **Flow**: User enters their username on the landing page → Click "View Stats" → Prompted to "Connect with Spotify" (OAuth) to authorize data access.
> - **Display**: Once authorized, the app displays:
>   1. **Top Tracks**
>   2. **Top Artists**
>   3. **Top Genres**
>   4. **Recently Played**

---

## Proposed Changes

### Component 1: Core App & Build Setup

- **`@tanstack/react-query`** for fetching and caching.
- `lz-string` for sharing.

---

### Component 2: CSS Styling

- Glassmorphic dark mode.
- Focused on clean list and grid layouts for stats.

---

### Component 3: Spotify API

- OAuth PKCE for authorization.
- Fetchers for: Top Tracks, Top Artists, Recently Played.
- Genre calculator.

---

### Component 4: Dashboard & Components

- **Dashboard**: Main view showing the 4 stat sections.
- **Navbar**: Profile and Auth management.
- **Sharing**: Generate compressed URL hash for the current view.

---

## Verification Plan

1. **Auth**: Login via Spotify.
2. **Data**: Confirm all 4 lists load correctly.
3. **Sharing**: Confirm URL hash restores the state.
