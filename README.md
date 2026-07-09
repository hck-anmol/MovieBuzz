# MovieBuzz — Movie Discovery App
MovieBuzz is a movie browsing app where you can search for films, check ratings,
read descriptions, and explore trending content. It pulls data from a public movie
API so the content is always fresh.
Live demo: [movie-buzz-topaz.vercel.app](https://movie-buzz-topaz.vercel.app)
## Tech Stack
- React.js (frontend)
- Node.js + Express (backend)
- TMDB API (movie data)
- Tailwind CSS
## Setup
```bash
git clone https://github.com/hck-anmol/MovieBuzz.git
cd MovieBuzz

Frontend:
bash

cd client
npm install
npm run dev

Backend:
bash

cd server
npm install
npm start
You'll need a TMDB API key. Create a .env in the server folder:

TMDB_API_KEY=your_api_key_here
PORT=5000