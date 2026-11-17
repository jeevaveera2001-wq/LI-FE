# Live tournaments.in — Frontend Application

React 19 single-page application built with Vite, Tailwind CSS v4, Lucide Icons, and Framer Motion.

## Directory Structure

- **`src/`**:
  - `components/`: HeroSection, TournamentsSection, HallOfFameSection, LeaderboardSection, RulesPrizesSection, SponsorsSection, LoginModal, TeamPortal, MatchOpsPortal, SuperAdminDashboard, etc.
  - `utils/`: Audio SFX, Auth & JWT helpers, Cloudinary uploader, local storage sync.
  - `assets/`: Background images, badges, icons, audio effects.
- **`public/`**: Public static assets, favicon, SVGs.
- **`index.html`**: Root HTML shell with typography and viewport definitions.

## Development

```bash
# Inside frontend directory:
npm install
npm run dev

# Or from repository root:
npm run dev
```

Dev server starts on `http://localhost:5173` and proxies `/api` calls to `http://localhost:5000`.
