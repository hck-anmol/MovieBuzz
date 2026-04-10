import express from 'express';
import pool from '../config/db.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get user bookings
router.get('/', protect, async (req, res) => {
  try {
    const [bookings] = await pool.query(`
      SELECT b.*, s.show_datetime, s.movie_id, m.title, m.poster_path 
      FROM bookings b
      JOIN shows s ON b.show_id = s.id
      JOIN movies m ON s.movie_id = m.id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
    `, [req.user.id]);

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

// Create booking
router.post('/', protect, async (req, res) => {
  const { showId, seats, amount } = req.body;
  if (!seats || seats.length === 0) {
    return res.status(400).json({ message: 'No seats selected' });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Insert booking
    const [bookingResult] = await connection.query(
      'INSERT INTO bookings (user_id, show_id, amount, is_paid) VALUES (?, ?, ?, ?)',
      [req.user.id, showId, amount, true] // true for demo
    );

    const bookingId = bookingResult.insertId;

    // Insert seats
    for (let seat of seats) {
      await connection.query(
        'INSERT INTO booked_seats (booking_id, seat_number, show_id) VALUES (?, ?, ?)',
        [bookingId, seat, showId]
      );
    }

    await connection.commit();
    res.status(201).json({ message: 'Booking successful', bookingId });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ message: 'Server error during booking' });
  } finally {
    connection.release();
  }
});

export default router;
