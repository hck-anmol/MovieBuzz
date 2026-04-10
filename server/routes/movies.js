import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [movies] = await pool.query('SELECT * FROM movies');
    const parsedMovies = movies.map(m => ({
        ...m,
        genres: typeof m.genres === 'string' ? JSON.parse(m.genres) : m.genres,
        casts: typeof m.casts === 'string' ? JSON.parse(m.casts) : m.casts
    }));
    res.json(parsedMovies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [movies] = await pool.query('SELECT * FROM movies WHERE id = ?', [req.params.id]);
    if (movies.length === 0) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    const movie = movies[0];
    movie.genres = typeof movie.genres === 'string' ? JSON.parse(movie.genres) : movie.genres;
    movie.casts = typeof movie.casts === 'string' ? JSON.parse(movie.casts) : movie.casts;
    
    res.json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
