import express from 'express';
import pool from '../config/db.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Simple admin check middleware
const adminOnly = (req, res, next) => {
    // For now, any logged-in user with role 'admin' can access
    // Or if you want to allow any logged-in user temporarily, just use protect
    next();
};

// ─── MOVIES ────────────────────────────────────────────────────────────────

// GET all movies
router.get('/movies', async (req, res) => {
    try {
        const [movies] = await pool.query('SELECT * FROM movies ORDER BY title');
        const parsed = movies.map(m => ({
            ...m,
            genres: typeof m.genres === 'string' ? JSON.parse(m.genres) : m.genres,
            casts: typeof m.casts === 'string' ? JSON.parse(m.casts) : m.casts,
        }));
        res.json(parsed);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST add movie
router.post('/movies', protect, async (req, res) => {
    const { id, title, overview, poster_path, backdrop_path, release_date, original_language, tagline, vote_average, vote_count, runtime, genres, casts } = req.body;

    if (!id || !title) {
        return res.status(400).json({ message: 'id and title are required' });
    }

    try {
        // Check duplicate
        const [existing] = await pool.query('SELECT id FROM movies WHERE id = ?', [id]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'A movie with this ID already exists' });
        }

        await pool.query(
            'INSERT INTO movies (id, title, overview, poster_path, backdrop_path, release_date, original_language, tagline, vote_average, vote_count, runtime, genres, casts) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [id, title, overview || null, poster_path || null, backdrop_path || null, release_date || null, original_language || 'en', tagline || null, vote_average || 0, vote_count || 0, runtime || 0, JSON.stringify(genres || []), JSON.stringify(casts || [])]
        );
        res.status(201).json({ message: 'Movie added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE movie
router.delete('/movies/:id', protect, async (req, res) => {
    try {
        await pool.query('DELETE FROM movies WHERE id = ?', [req.params.id]);
        res.json({ message: 'Movie deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ─── SHOWS ─────────────────────────────────────────────────────────────────

// GET all shows (with movie title and theater name)
router.get('/shows', async (req, res) => {
    try {
        const [shows] = await pool.query(`
            SELECT shows.*, movies.title as movie_title, theaters.name as theater_name
            FROM shows 
            JOIN movies ON shows.movie_id = movies.id 
            LEFT JOIN theaters ON shows.theater_id = theaters.id
            ORDER BY shows.show_datetime DESC
        `);
        res.json(shows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST add show
router.post('/shows', protect, async (req, res) => {
    const { id, movie_id, theater_id, show_datetime, price } = req.body;

    if (!id || !movie_id || !theater_id || !show_datetime || !price) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const [existing] = await pool.query('SELECT id FROM shows WHERE id = ?', [id]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'A show with this ID already exists' });
        }

        // Format datetime for MySQL
        const datetimeForMySQL = show_datetime.replace('T', ' ').replace('Z', '').substring(0, 19);

        await pool.query(
            'INSERT INTO shows (id, movie_id, theater_id, show_datetime, price) VALUES (?, ?, ?, ?, ?)',
            [id, movie_id, theater_id, datetimeForMySQL, parseFloat(price)]
        );
        res.status(201).json({ message: 'Show added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE show
router.delete('/shows/:id', protect, async (req, res) => {
    try {
        await pool.query('DELETE FROM shows WHERE id = ?', [req.params.id]);
        res.json({ message: 'Show deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ─── THEATERS ──────────────────────────────────────────────────────────────

// GET all theaters
router.get('/theaters', async (req, res) => {
    try {
        const [theaters] = await pool.query('SELECT * FROM theaters ORDER BY city, name');
        res.json(theaters);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST add theater
router.post('/theaters', protect, async (req, res) => {
    const { id, name, city, address } = req.body;

    if (!id || !name || !city) {
        return res.status(400).json({ message: 'ID, Name, and City are required' });
    }

    try {
        const [existing] = await pool.query('SELECT id FROM theaters WHERE id = ?', [id]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'A theater with this ID already exists' });
        }

        await pool.query(
            'INSERT INTO theaters (id, name, city, address, added_by) VALUES (?, ?, ?, ?, ?)',
            [id, name, city, address || null, req.user.id]
        );
        res.status(201).json({ message: 'Theater added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE theater
router.delete('/theaters/:id', protect, async (req, res) => {
    try {
        await pool.query('DELETE FROM theaters WHERE id = ?', [req.params.id]);
        res.json({ message: 'Theater deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ─── BOOKINGS ──────────────────────────────────────────────────────────────

// GET all bookings with user + movie info
router.get('/bookings', protect, async (req, res) => {
    try {
        const [bookings] = await pool.query(`
            SELECT b.*, 
                   s.show_datetime, s.movie_id, 
                   m.title, m.poster_path,
                   u.name as user_name, u.email as user_email
            FROM bookings b
            JOIN shows s ON b.show_id = s.id
            JOIN movies m ON s.movie_id = m.id
            JOIN users u ON b.user_id = u.id
            ORDER BY b.created_at DESC
        `);

        for (let booking of bookings) {
            const [seats] = await pool.query('SELECT seat_number FROM booked_seats WHERE booking_id = ?', [booking.id]);
            booking.bookedSeats = seats.map(s => s.seat_number);
        }

        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;