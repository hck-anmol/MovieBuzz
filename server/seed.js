import pool from './config/db.js';
import { dummyShowsData, activeShows } from './seedData.js';
import bcrypt from 'bcryptjs';

const seedDatabase = async () => {
  try {
    console.log('Connecting to DB and creating tables...');
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS movies (
        id VARCHAR(50) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        overview TEXT,
        poster_path VARCHAR(255),
        backdrop_path VARCHAR(255),
        release_date VARCHAR(20),
        original_language VARCHAR(10),
        tagline VARCHAR(255),
        vote_average FLOAT,
        vote_count INT,
        runtime INT,
        genres JSON,
        casts JSON
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS theaters (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        city VARCHAR(100) NOT NULL,
        address TEXT,
        added_by INT,
        lat DECIMAL(10, 8),
        lon DECIMAL(11, 8),
        FOREIGN KEY (added_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS shows (
        id VARCHAR(50) PRIMARY KEY,
        movie_id VARCHAR(50),
        theater_id VARCHAR(50),
        show_datetime DATETIME,
        price DECIMAL(10, 2),
        FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
        FOREIGN KEY (theater_id) REFERENCES theaters(id) ON DELETE CASCADE
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        show_id VARCHAR(50),
        amount DECIMAL(10, 2),
        is_paid BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (show_id) REFERENCES shows(id) ON DELETE CASCADE
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS booked_seats (
        id INT AUTO_INCREMENT PRIMARY KEY,
        booking_id INT,
        seat_number VARCHAR(10),
        show_id VARCHAR(50),
        FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
        FOREIGN KEY (show_id) REFERENCES shows(id) ON DELETE CASCADE
      )
    `);

    console.log('Tables created. Checking if Data is already seeded...');

    const [rows] = await pool.query('SELECT COUNT(*) as count FROM movies');
    
    if (rows[0].count === 0) {
      console.log('Seeding movies...');
      for (const movie of dummyShowsData) {
        await pool.query(
          'INSERT INTO movies (id, title, overview, poster_path, backdrop_path, release_date, original_language, tagline, vote_average, vote_count, runtime, genres, casts) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [movie._id, movie.title, movie.overview, movie.poster_path, movie.backdrop_path, movie.release_date, movie.original_language, movie.tagline, movie.vote_average, movie.vote_count, movie.runtime, JSON.stringify(movie.genres), JSON.stringify(movie.casts)]
        );
      }

      console.log('Seeding default theater...');
      const defaultTheaterId = 'default_theater_1';
      await pool.query(
        'INSERT INTO theaters (id, name, city, address, lat, lon) VALUES (?, ?, ?, ?, ?, ?)',
        [defaultTheaterId, 'Cinepolis Default', 'Mumbai', 'Default Mall, Mumbai', 19.0760, 72.8777]
      );

      console.log('Seeding shows...');
      for (const show of activeShows) {
        const datetimeParts = show.showDateTime.replace('T', ' ').replace('.000Z', '');
        await pool.query(
          'INSERT INTO shows (id, movie_id, theater_id, show_datetime, price) VALUES (?, ?, ?, ?, ?)',
          [show._id, show.movie_id, defaultTheaterId, datetimeParts, show.showPrice]
        );
      }
      console.log('Data seeded successfully!');
    } else {
      console.log('Data already exists, skipping seeding.');
    }
    process.exit();
  } catch (error) {
    console.error('Error seeding DB:', error);
    process.exit(1);
  }
};

seedDatabase();
