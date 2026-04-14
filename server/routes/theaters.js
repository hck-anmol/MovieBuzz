import express from 'express';
import pool from '../config/db.js';
import axios from 'axios';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { city, movieId, date } = req.query;
        if (!city) {
            return res.status(400).json({ message: 'City is required' });
        }

        // 1. Fetch theaters for the city from our DB
        const [theaters] = await pool.query('SELECT * FROM theaters WHERE LOWER(city) = LOWER(?)', [city]);
        let cityTheaters = theaters;

        // 2. If no theaters exist for this city locally, fetch from OpenStreetMap
        if (theaters.length === 0) {
            console.log(`No theaters found in DB for ${city}. Fetching from OpenStreetMap...`);
            
            // Overpass API Query
            const query = `
                [out:json];
                area[name="${city}"]->.searchArea;
                node["amenity"="cinema"](area.searchArea);
                out center limit 15;
            `;
            
            try {
                const response = await axios.post('https://overpass-api.de/api/interpreter', query, {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                });
                
                const nodes = response.data.elements || [];
                
                for (let node of nodes) {
                    const id = `osm_${node.id}`;
                    const name = node.tags?.name || 'Local Cinema';
                    const lat = node.lat;
                    const lon = node.lon;
                    
                    await pool.query(
                        'INSERT IGNORE INTO theaters (id, name, city, lat, lon) VALUES (?, ?, ?, ?, ?)',
                        [id, name, city, lat, lon]
                    );
                    
                    cityTheaters.push({ id, name, city, lat, lon });
                }
            } catch (apiErr) {
               console.error('OSM API failed, continuing with empty theaters', apiErr.message);
            }
        }
        
        // 3. If a movieId and date are provided, ensure these theaters have some shows for this movie on this date
        if (movieId && date && cityTheaters.length > 0) {
            for (let t of cityTheaters) {
                // Check if shows exist for this theater, movie, and date
                const [shows] = await pool.query(
                    'SELECT id FROM shows WHERE theater_id = ? AND movie_id = ? AND DATE(show_datetime) = ?',
                    [t.id, movieId, date]
                );
                
                if (shows.length === 0) {
                    // Create dummy shows to simulate real availability
                    const times = ['10:00:00', '13:30:00', '16:15:00', '19:40:00', '22:15:00'];
                    // randomly pick 2-3 times
                    const shuffledTimes = times.sort((() => 0.5 - Math.random())).slice(0, 3 + Math.floor(Math.random()*2));
                    // sort chronological
                    shuffledTimes.sort();

                    for (let time of shuffledTimes) {
                        const showId = `show_${t.id}_${movieId}_${Math.random().toString(36).substring(2,8)}`;
                        const showDatetime = `${date} ${time}`;
                        const price = Math.floor(Math.random() * (250) + 150); // random price 150-400
                        
                        await pool.query(
                            'INSERT INTO shows (id, movie_id, theater_id, show_datetime, price) VALUES (?, ?, ?, ?, ?)',
                            [showId, movieId, t.id, showDatetime, price]
                        );
                    }
                }
            }
        }

        res.json(cityTheaters);
    } catch (error) {
        console.error('Error fetching theaters:', error);
        res.status(500).json({ message: 'Server error fetching theaters' });
    }
});

export default router;
