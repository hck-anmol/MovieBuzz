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

// Delete booking
router.delete('/:id', protect, async (req, res) => {
  try {
    const [booking] = await pool.query('SELECT * FROM bookings WHERE id = ?', [req.params.id]);
    if (booking.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    if (booking[0].user_id !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to delete this booking' });
    }

    await pool.query('DELETE FROM bookings WHERE id = ?', [req.params.id]);
    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error cancelling booking' });
  }
});

// Get booking details for invite (unprotected, only returns show info and seat numbers)
router.get('/invite/:id', async (req, res) => {
  try {
    const [booking] = await pool.query(`
      SELECT b.id, u.name as user_name
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      WHERE b.id = ?
    `, [req.params.id]);

    if (booking.length === 0) {
      return res.status(404).json({ message: 'Invite not found' });
    }

    const [seats] = await pool.query('SELECT seat_number FROM booked_seats WHERE booking_id = ?', [req.params.id]);
    
    res.json({
      inviterName: booking[0].user_name,
      bookedSeats: seats.map(s => s.seat_number)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
