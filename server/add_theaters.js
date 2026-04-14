import pool from './config/db.js';

const cities = [
  'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Ahmedabad',
  'Chennai', 'Kolkata', 'Surat', 'Pune', 'Jaipur',
  'Lucknow', 'Kanpur', 'Nagpur', 'Visakhapatnam', 'Indore',
  'Bhopal', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana'
];

// Base theater brands and their approximate coordinates for India center
const brands = [
  { name: 'PVR Cinemas', latOffset: 0.01, lonOffset: 0.01 },
  { name: 'INOX', latOffset: -0.01, lonOffset: -0.01 },
  { name: 'Cinepolis', latOffset: 0.02, lonOffset: -0.02 },
];

const seedTheaters = async () => {
    try {
        console.log('Inserting 3 theaters for each city...');
        let count = 0;
        
        for (let city of cities) {
            // Rough generic coordinates, doesn't matter since client isn't mapping them yet
            const baseLat = 20.5937;
            const baseLon = 78.9629;
            
            for (let i = 0; i < 3; i++) {
                const brand = brands[i];
                const theaterId = `t_${city.toLowerCase()}_${i}`;
                const name = `${brand.name} ${city} Center`;
                const address = `Central Mall, ${city}`;
                
                await pool.query(
                    'INSERT IGNORE INTO theaters (id, name, city, address, lat, lon) VALUES (?, ?, ?, ?, ?, ?)',
                    [theaterId, name, city, address, baseLat + brand.latOffset, baseLon + brand.lonOffset]
                );
                count++;
            }
        }
        
        console.log(`Successfully added ${count} theaters across ${cities.length} cities.`);
        process.exit(0);
    } catch (err) {
        console.error('Error seeding theaters:', err);
        process.exit(1);
    }
};

seedTheaters();
