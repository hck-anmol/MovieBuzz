import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { movie_id, date } = req.query;
    let query = 'SELECT shows.*, movies.title as movie_title, movies.poster_path FROM shows JOIN movies ON shows.movie_id = movies.id';
    let queryParams = [];

    if (movie_id) {
       query += ' WHERE shows.movie_id = ?';
       queryParams.push(movie_id);
    }
    
    // Simplification for date filtering
    if (date) {
        if(movie_id) {
           query += ' AND DATE(shows.show_datetime) = ?'
        } else {
           query += ' WHERE DATE(shows.show_datetime) = ?'
        }
        queryParams.push(date);
    }

    const [shows] = await pool.query(query, queryParams);
    
    // Group by date if needed, or just return the list
    res.json(shows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [shows] = await pool.query(`
      SELECT shows.*, movies.title as movie_title, movies.poster_path 
      FROM shows 
      JOIN movies ON shows.movie_id = movies.id 
      WHERE shows.id = ?`, 
      [req.params.id]
    );

    if (shows.length === 0) {
      return res.status(404).json({ message: 'Show not found' });
    }
    
    // fetch occupied seats
    const [bookedSeats] = await pool.query('SELECT seat_number FROM booked_seats WHERE show_id = ?', [req.params.id]);
    
    const show = shows[0];
    show.occupiedSeats = bookedSeats.map(bs => bs.seat_number);

    res.json(show);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
