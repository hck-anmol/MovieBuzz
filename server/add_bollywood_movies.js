import pool from './config/db.js';

const newMovies = [
    {
        id: "m_main_tera_hero",
        title: "Main Tera Hero",
        overview: "Sreenath Prasad aka Seenu is the most notorious boy in Ooty. He drops out of college in Ooty in order to pursue education in a Bangalore college, where he falls in love with Sunaina.",
        poster_path: "https://placehold.co/600x900/1e293b/ffffff?text=Main+Tera+Hero",
        backdrop_path: "https://placehold.co/1200x600/1e293b/ffffff?text=Main+Tera+Hero",
        release_date: "2014-04-04",
        original_language: "hi",
        vote_average: 5.4,
        vote_count: 230,
        runtime: 120,
        genres: ["Comedy", "Action", "Romance"],
        casts: ["Varun Dhawan", "Ileana D'Cruz", "Nargis Fakhri"]
    },
    {
        id: "m_3_idiots",
        title: "3 Idiots",
        overview: "In the tradition of 'Ferris Bueller's Day Off' comes this refreshing comedy about a rebellious prankster with a crafty mind and a heart of gold.",
        poster_path: "https://placehold.co/600x900/1e293b/ffffff?text=3+Idiots",
        backdrop_path: "https://placehold.co/1200x600/1e293b/ffffff?text=3+Idiots",
        release_date: "2009-12-25",
        original_language: "hi",
        vote_average: 8.4,
        vote_count: 5200,
        runtime: 170,
        genres: ["Drama", "Comedy"],
        casts: ["Aamir Khan", "R. Madhavan", "Sharman Joshi", "Kareena Kapoor"]
    },
    {
        id: "m_dhurandar",
        title: "Dhurandar",
        overview: "An action packed ride with the charismatic hero taking on the biggest syndicates.",
        poster_path: "https://placehold.co/600x900/1e293b/ffffff?text=Dhurandar",
        backdrop_path: "https://placehold.co/1200x600/1e293b/ffffff?text=Dhurandar",
        release_date: "2021-08-15",
        original_language: "hi",
        vote_average: 7.1,
        vote_count: 850,
        runtime: 145,
        genres: ["Action", "Thriller"],
        casts: ["Ranveer Singh", "Pooja Hegde"]
    },
    {
        id: "m_badrinath",
        title: "Badrinath Ki Dulhania",
        overview: "Badrinath Bansal from Jhansi and Vaidehi Trivedi from Kota belong to small towns but have diametrically opposite opinions on everything.",
        poster_path: "https://placehold.co/600x900/1e293b/ffffff?text=Badrinath+Ki+Dulhania",
        backdrop_path: "https://placehold.co/1200x600/1e293b/ffffff?text=Badrinath+Ki+Dulhania",
        release_date: "2017-03-10",
        original_language: "hi",
        vote_average: 6.2,
        vote_count: 310,
        runtime: 139,
        genres: ["Comedy", "Romance", "Drama"],
        casts: ["Varun Dhawan", "Alia Bhatt"]
    },
    {
        id: "m_maharaja",
        title: "Maharaja",
        overview: "A masterful plot unfolding the mystery of an ordinary man seeking extraordinary justice.",
        poster_path: "https://placehold.co/600x900/1e293b/ffffff?text=Maharaja",
        backdrop_path: "https://placehold.co/1200x600/1e293b/ffffff?text=Maharaja",
        release_date: "2024-06-14",
        original_language: "ta",
        vote_average: 8.8,
        vote_count: 673,
        runtime: 151,
        genres: ["Action", "Thriller"],
        casts: ["Vijay Sethupathi", "Anurag Kashyap"]
    },
    {
        id: "m_humpty",
        title: "Humpty Sharma Ki Dulhania",
        overview: "When Kavya Pratap Singh, a chirpy, yet feisty girl from Ambala, decides to make a trip to Delhi for her marriage shopping, she meets a young, carefree Delhi lad, Humpty Sharma.",
        poster_path: "https://placehold.co/600x900/1e293b/ffffff?text=Humpty+Sharma+Ki+Dulhania",
        backdrop_path: "https://placehold.co/1200x600/1e293b/ffffff?text=Humpty+Sharma+Ki+Dulhania",
        release_date: "2014-07-11",
        original_language: "hi",
        vote_average: 6.0,
        vote_count: 247,
        runtime: 133,
        genres: ["Comedy", "Romance"],
        casts: ["Varun Dhawan", "Alia Bhatt", "Sidharth Shukla"]
    },
    {
        id: "m_harry_potter_6",
        title: "Harry Potter and the Half-Blood Prince",
        overview: "As Harry begins his sixth year at Hogwarts, he discovers an old book marked as 'the property of the Half-Blood Prince'.",
        poster_path: "https://placehold.co/600x900/1e293b/ffffff?text=Harry+Potter+and+the+Half-Blood+Prince",
        backdrop_path: "https://placehold.co/1200x600/1e293b/ffffff?text=Harry+Potter",
        release_date: "2009-07-07",
        original_language: "en",
        vote_average: 7.7,
        vote_count: 18000,
        runtime: 153,
        genres: ["Adventure", "Fantasy", "Family"],
        casts: ["Daniel Radcliffe", "Rupert Grint", "Emma Watson"]
    },
    {
        id: "m_dangal",
        title: "Dangal",
        overview: "Former wrestler Mahavir Singh Phogat and his two wrestler daughters struggle towards glory at the Commonwealth Games in the face of societal oppression.",
        poster_path: "https://placehold.co/600x900/1e293b/ffffff?text=Dangal",
        backdrop_path: "https://placehold.co/1200x600/1e293b/ffffff?text=Dangal",
        release_date: "2016-12-23",
        original_language: "hi",
        vote_average: 8.4,
        vote_count: 9000,
        runtime: 161,
        genres: ["Action", "Biography", "Drama"],
        casts: ["Aamir Khan", "Sakshi Tanwar", "Fatima Sana Shaikh"]
    },
    {
        id: "m_pathaan",
        title: "Pathaan",
        overview: "An Indian spy takes on the leader of a group of mercenaries who have nefarious plans to target his homeland.",
        poster_path: "https://placehold.co/600x900/1e293b/ffffff?text=Pathaan",
        backdrop_path: "https://placehold.co/1200x600/1e293b/ffffff?text=Pathaan",
        release_date: "2023-01-25",
        original_language: "hi",
        vote_average: 6.7,
        vote_count: 1200,
        runtime: 146,
        genres: ["Action", "Thriller"],
        casts: ["Shah Rukh Khan", "John Abraham", "Deepika Padukone"]
    },
    {
        id: "m_jawan",
        title: "Jawan",
        overview: "A high-octane action thriller which outlines the emotional journey of a man who is set to rectify the wrongs in the society.",
        poster_path: "https://placehold.co/600x900/1e293b/ffffff?text=Jawan",
        backdrop_path: "https://placehold.co/1200x600/1e293b/ffffff?text=Jawan",
        release_date: "2023-09-07",
        original_language: "hi",
        vote_average: 7.2,
        vote_count: 900,
        runtime: 169,
        genres: ["Action", "Thriller"],
        casts: ["Shah Rukh Khan", "Nayanthara", "Vijay Sethupathi"]
    },
    {
        id: "m_animal",
        title: "Animal",
        overview: "A son's obsessive love for his father leads to massive underworld bloodshed.",
        poster_path: "https://placehold.co/600x900/1e293b/ffffff?text=Animal",
        backdrop_path: "https://placehold.co/1200x600/1e293b/ffffff?text=Animal",
        release_date: "2023-12-01",
        original_language: "hi",
        vote_average: 6.8,
        vote_count: 750,
        runtime: 201,
        genres: ["Action", "Crime", "Drama"],
        casts: ["Ranbir Kapoor", "Anil Kapoor", "Bobby Deol"]
    },
    {
        id: "m_sholay",
        title: "Sholay",
        overview: "After his family is murdered by a notorious and ruthless bandit, a former police officer enlists the services of two outlaws to capture him.",
        poster_path: "https://placehold.co/600x900/1e293b/ffffff?text=Sholay",
        backdrop_path: "https://placehold.co/1200x600/1e293b/ffffff?text=Sholay",
        release_date: "1975-08-15",
        original_language: "hi",
        vote_average: 8.2,
        vote_count: 420,
        runtime: 204,
        genres: ["Action", "Adventure", "Comedy"],
        casts: ["Dharmendra", "Amitabh Bachchan", "Sanjeev Kumar", "Amjad Khan"]
    },
    {
        id: "m_bajrangi_bhaijaan",
        title: "Bajrangi Bhaijaan",
        overview: "An Indian man with a magnanimous heart takes a young mute Pakistani girl back to her homeland to reunite her with her family.",
        poster_path: "https://placehold.co/600x900/1e293b/ffffff?text=Bajrangi+Bhaijaan",
        backdrop_path: "https://placehold.co/1200x600/1e293b/ffffff?text=Bajrangi+Bhaijaan",
        release_date: "2015-07-17",
        original_language: "hi",
        vote_average: 8.1,
        vote_count: 3100,
        runtime: 159,
        genres: ["Action", "Comedy", "Drama"],
        casts: ["Salman Khan", "Kareena Kapoor Khan", "Nawazuddin Siddiqui"]
    },
    {
        id: "m_pk",
        title: "PK",
        overview: "An alien on Earth loses the only device he can use to communicate with his spaceship. His innocent nature and child-like questions force the country to evaluate the impact of religion on its people.",
        poster_path: "https://placehold.co/600x900/1e293b/ffffff?text=PK",
        backdrop_path: "https://placehold.co/1200x600/1e293b/ffffff?text=PK",
        release_date: "2014-12-19",
        original_language: "hi",
        vote_average: 8.1,
        vote_count: 4500,
        runtime: 153,
        genres: ["Comedy", "Drama", "Sci-Fi"],
        casts: ["Aamir Khan", "Anushka Sharma", "Sushant Singh Rajput"]
    },
    {
        id: "m_chak_de_india",
        title: "Chak De! India",
        overview: "Kabir Khan, the coach of the Indian Women's National Hockey Team, dreams of making his all girls team emerge victorious against all odds.",
        poster_path: "https://placehold.co/600x900/1e293b/ffffff?text=Chak+De+India",
        backdrop_path: "https://placehold.co/1200x600/1e293b/ffffff?text=Chak+De+India",
        release_date: "2007-08-10",
        original_language: "hi",
        vote_average: 8.1,
        vote_count: 1200,
        runtime: 153,
        genres: ["Drama", "Family", "Sport"],
        casts: ["Shah Rukh Khan", "Vidya Malvade", "Sagarika Ghatge"]
    },
    {
        id: "m_kgf_chapter_1",
        title: "K.G.F: Chapter 1",
        overview: "In the 1970s, a gangster goes undercover as a slave to assassinate the owner of a notorious gold mine.",
        poster_path: "https://placehold.co/600x900/1e293b/ffffff?text=KGF+Chapter+1",
        backdrop_path: "https://placehold.co/1200x600/1e293b/ffffff?text=KGF+Chapter+1",
        release_date: "2018-12-20",
        original_language: "kn",
        vote_average: 8.2,
        vote_count: 3400,
        runtime: 156,
        genres: ["Action", "Drama", "History"],
        casts: ["Yash", "Srinidhi Shetty", "Ramachandra Raju"]
    },
    {
        id: "m_rr",
        title: "RRR",
        overview: "A fictitious story about two legendary revolutionaries and their journey away from home before they started fighting for their country in 1920s.",
        poster_path: "https://placehold.co/600x900/1e293b/ffffff?text=RRR",
        backdrop_path: "https://placehold.co/1200x600/1e293b/ffffff?text=RRR",
        release_date: "2022-03-24",
        original_language: "te",
        vote_average: 7.8,
        vote_count: 5200,
        runtime: 187,
        genres: ["Action", "Adventure", "Drama"],
        casts: ["N.T. Rama Rao Jr.", "Ram Charan", "Alia Bhatt"]
    },
    {
        id: "m_baahubali",
        title: "Baahubali: The Beginning",
        overview: "In ancient India, an adventurous and daring man becomes involved in a decades-old feud between two warring peoples.",
        poster_path: "https://placehold.co/600x900/1e293b/ffffff?text=Baahubali",
        backdrop_path: "https://placehold.co/1200x600/1e293b/ffffff?text=Baahubali",
        release_date: "2015-07-09",
        original_language: "te",
        vote_average: 8.0,
        vote_count: 4500,
        runtime: 159,
        genres: ["Action", "Drama", "Fantasy"],
        casts: ["Prabhas", "Rana Daggubati", "Anushka Shetty"]
    },
    {
        id: "m_yeh_jawaani",
        title: "Yeh Jawaani Hai Deewani",
        overview: "Kabir and Naina bond during a trekking trip. Before Naina can express herself, Kabir leaves India to pursue his career. They meet again years later, but he still cherishes his dreams more than bonds.",
        poster_path: "https://placehold.co/600x900/1e293b/ffffff?text=Yeh+Jawaani+Hai+Deewani",
        backdrop_path: "https://placehold.co/1200x600/1e293b/ffffff?text=Yeh+Jawaani+Hai+Deewani",
        release_date: "2013-05-31",
        original_language: "hi",
        vote_average: 7.2,
        vote_count: 850,
        runtime: 160,
        genres: ["Drama", "Musical", "Romance"],
        casts: ["Ranbir Kapoor", "Deepika Padukone", "Aditya Roy Kapoor"]
    },
    {
        id: "m_kabir_singh",
        title: "Kabir Singh",
        overview: "An expansive, flawed romantic drama about a surgeon who spirals down into a path of self-destruction after his sweetheart is forced to marry another man.",
        poster_path: "https://placehold.co/600x900/1e293b/ffffff?text=Kabir+Singh",
        backdrop_path: "https://placehold.co/1200x600/1e293b/ffffff?text=Kabir+Singh",
        release_date: "2019-06-21",
        original_language: "hi",
        vote_average: 7.1,
        vote_count: 520,
        runtime: 172,
        genres: ["Action", "Drama", "Romance"],
        casts: ["Shahid Kapoor", "Kiara Advani"]
    }
];

const seedBollywood = async () => {
    try {
        console.log(`Inserting ${newMovies.length} movies...`);

        for (let movie of newMovies) {
            await pool.query(
                'INSERT IGNORE INTO movies (id, title, overview, poster_path, backdrop_path, release_date, original_language, vote_average, vote_count, runtime, genres, casts) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    movie.id, 
                    movie.title, 
                    movie.overview || null, 
                    movie.poster_path || null, 
                    movie.backdrop_path || null, 
                    movie.release_date || null, 
                    movie.original_language || 'en', 
                    movie.vote_average || 0, 
                    movie.vote_count || 0, 
                    movie.runtime || 0, 
                    JSON.stringify(movie.genres || []), 
                    JSON.stringify(movie.casts || [])
                ]
            );
        }

        console.log('Successfully seeded new Bollywood movies!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding Bollywood movies:', err);
        process.exit(1);
    }
};

seedBollywood();
