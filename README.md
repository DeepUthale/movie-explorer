# 🎬 Movie Explorer

🌐 **Hosted App:** 

Movie Explorer lets users search movies, open a details view, and save favorites with a personal rating (1–5) and optional note. Movie data is fetched from TMDB through server-side Next.js proxy routes (so the API key stays hidden). Favorites are persisted in LocalStorage so they survive refresh

---

## ✨ Core Features 

- **Search** by movie title (poster, title, year/release date, short description)
- **Details** view (modal) with poster, overview, year, runtime
- **Favorites** add/remove + rating (1–5) + optional note
- **Persistence** via LocalStorage
- **API Proxy** via Next.js route handlers (TMDB key not exposed)
- **Error handling** for no results, invalid inputs, and API/network issues

---

## 🛠️ Setup & Run (Local)

### Prereqs
- Node.js 18+ (recommended)
- TMDB API key ([Get here](https://www.themoviedb.org/settings/api))

### 1️⃣ Install
```bash
npm install
```

### 2️⃣ Configure env
Create `.env.local` in the project root:
```
TMDB_API_KEY=your_tmdb_api_key_here
```

### 3️⃣ Run dev
```bash
npm run dev
```
Open: http://localhost:3000

---

## 🧩 Architecture
```
User Interface (Next.js)
    ├─> /api/movies/search -> TMDB API
    ├─> /api/movies/[id] -> TMDB API
    └─> LocalStorage (Favorites)
```

**Data Flow:**
1. User searches -> Frontend calls `/api/movies/search`
2. API route proxies to TMDB with server-side key
3. Results displayed -> User clicks movie
4. Modal opens -> Fetches details from `/api/movies/[id]`
5. User adds favorite -> Saved to LocalStorage
6. Page refresh -> Favorites loaded from LocalStorage

---

## 🧠 Technical Decisions & Tradeoffs

### 🛡️ API proxy (TMDB key stays server-side)
- I used Next.js Route Handlers under `app/api/movies/*` as a thin proxy to TMDB
- This keeps the TMDB API key on the server (`TMDB_API_KEY` in `.env.local`) and avoids exposing it in the browser.

### 🧩 State management (simple hooks, no heavy libs)
- Favorites are managed with React `useState` and helper functions in `lib/favorites.ts`.
- I avoided Redux/Zustand since the app is small and the requirements focus on a working prototype.
- **Tradeoff:** not ideal for huge apps with complex state, but clean and easy to reason about for this scope

### 💾 Persistence choice (LocalStorage baseline)
- Favorites persist via LocalStorage so they survive refresh and require no DB setup.
- **Tradeoff:** data is per-browser and not shareable across devices/users.
- **In Future:** add server persistence with API routes + PostgreSQL/MongoDB + authentication.

### 🎨 Component architecture (simple prop drilling)
- Used simple parent-child component communication via props and callbacks.
- Only 3 main components: SearchBar, MovieCard, MovieModal.

---

## ✅ Technical Requirements Checklist

### 🎨 Frontend
- ✅ Next.js 15 (App Router) + React
- ✅ TypeScript used across UI and API code
- ✅ Tailwind CSS for styling

### 🧰 Backend
- ✅ Next.js Route Handlers proxy TMDB:
  - `GET /api/movies/search` - Search movies
  - `GET /api/movies/[id]` - Get movie details

### 🗃️ Data
- ✅ LocalStorage used for favorites persistence (baseline requirement met)

---

## ⚠️ Known Limitations

- **Favorites are client-only** (LocalStorage), not synced across devices
- **No authentication**, so favorites are not tied to a user account
- **Search limited to first page** (20 results, no pagination)
- **No filters** (genre, year, rating range)
- **Favorites can't be sorted** (by date, rating, or title)

---

## 🚀 What I'd Improve With More Time

### Database & Auth
- Add server-side persistence:
  - API routes: `POST/GET/PATCH/DELETE /api/favorites`
  - Database: PostgreSQL + Prisma ORM
  - Authentication: NextAuth.js to tie favorites to user accounts

### UX Improvements
- Add pagination or infinite scroll for search results
- Debounced search input to reduce API calls
- Filter movies by genre, year, rating range
- Sort favorites by rating, date added, or alphabetically

### Polish & Testing
- Improve accessibility:
  - Keyboard navigation (arrow keys, enter, escape)
- Add unit tests (React Testing Library)
- Error logging
- Performance monitoring

### Advanced Features
- Watchlist separate from favorites
- Movie recommendations based on favorites
- Export favorites as JSON/CSV
- Dark mode
- Share favorite lists with friends/social media

---

## 📦 Project Structure
```
movie-explorer/
├── app/
│   ├── api/
│   │   └── movies/
│   │       ├── search/route.ts      # Search proxy endpoint
│   │       └── [id]/route.ts        # Details proxy endpoint
│   ├── page.tsx                     # Main app
│   ├── layout.tsx                   # Root layout
│   └── globals.css                  # Global styles
├── components/
│   ├── SearchBar.tsx                # Search input 
│   ├── MovieCard.tsx                # Movie card 
│   └── MovieModal.tsx               # Details modal
├── lib/
│   └── favorites.ts                 # LocalStorage helpers 
├── types/
│   └── movie.ts                     # TypeScript interfaces
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
├── tailwind.config.js              # Tailwind config
└── next.config.js                  # Next.js config
```
