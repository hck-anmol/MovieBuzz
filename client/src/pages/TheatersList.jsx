import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCity } from '../context/CityContext';
import BlurCircle from '../components/BlurCircle';
import { MapPin, Info } from 'lucide-react';
import toast from 'react-hot-toast';

const TheatersList = () => {
    const { id, date } = useParams();
    const { city } = useCity();
    const navigate = useNavigate();

    const [movie, setMovie] = useState(null);
    const [theaters, setTheaters] = useState([]);
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!city) {
            toast.error("Please select a city first");
            navigate(`/movies/${id}`);
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch Movie
                const { data: movieData } = await axios.get(`/api/movies/${id}`);
                setMovie(movieData);

                // Fetch Theaters for this city (backend will auto-populate from OSM and generate shows if empty)
                const { data: theatersData } = await axios.get(`/api/theaters?city=${city}&movieId=${id}&date=${date}`);
                setTheaters(theatersData);

                // Fetch Shows for this movie and date
                const { data: showsData } = await axios.get(`/api/shows?movie_id=${id}&date=${date}`);
                setShows(showsData);

            } catch (error) {
                console.error("Error fetching theaters data:", error);
                toast.error("Failed to load theaters");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [city, id, date]);

    if (loading) {
        return (
            <div className='flex flex-col justify-center items-center h-screen gap-4'>
                <div className="w-16 h-16 border-4 border-gray-600 border-t-primary rounded-full animate-spin"></div>
                <p className="text-gray-400">Loading theaters in {city}...</p>
            </div>
        );
    }

    // Group shows by theater
    const showsByTheater = {};
    shows.forEach(show => {
        if (!showsByTheater[show.theater_id]) {
            showsByTheater[show.theater_id] = [];
        }
        showsByTheater[show.theater_id].push(show);
    });

    // Make sure we only show theaters that have shows
    const activeTheaters = theaters.filter(t => showsByTheater[t.id] && showsByTheater[t.id].length > 0);

    return (
        <div className='px-6 md:px-16 lg:px-40 pt-28 pb-20 min-h-[80vh] relative'>
            <BlurCircle top='-5%' left='-5%' />
            <BlurCircle top='50%' right='-5%' />

            {/* Header section matching BMS style */}
            {movie && (
                <div className='bg-white/5 border border-white/10 p-6 rounded-xl mb-8 flex flex-col md:flex-row gap-6 items-start md:items-center'>
                    <img src={movie.poster_path} alt={movie.title} className='w-24 h-36 object-cover rounded shadow-lg' />
                    <div>
                        <h1 className='text-3xl font-bold mb-2'>{movie.title} - {movie.original_language?.toUpperCase() || 'EN'}</h1>
                        <div className='flex gap-4 items-center text-gray-400 text-sm'>
                            {movie.genres?.map(g => (
                                <span key={g.id} className='px-2 py-1 border border-gray-600 rounded-full text-xs'>{g.name}</span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className='mb-8 pb-4 border-b border-white/10 flex justify-between items-end'>
                <div>
                    <h2 className='text-2xl font-semibold flex items-center gap-2'>
                        <MapPin className="text-primary w-6 h-6" /> Theaters in {city}
                    </h2>
                    <p className='text-gray-400 mt-1'>
                        Showing times for <span className="text-white font-medium">{new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </p>
                </div>
            </div>

            {activeTheaters.length === 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-xl p-10 text-center flex flex-col items-center">
                    <Info className="w-12 h-12 text-gray-500 mb-4" />
                    <h3 className="text-xl font-medium mb-2">No shows available</h3>
                    <p className="text-gray-400">There are no showtimes available for this movie on the selected date in {city}.</p>
                    <button 
                        onClick={() => navigate(`/movies/${id}`)}
                        className="mt-6 px-6 py-2 bg-primary/20 hover:bg-primary/40 text-primary rounded transition"
                    >
                        Go back & Pick another date
                    </button>
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {activeTheaters.map(theater => (
                        <div key={theater.id} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                <div className="md:w-1/3">
                                    <h3 className="text-xl font-medium flex items-center gap-2">
                                        {theater.name}
                                    </h3>
                                    <p className="text-gray-400 text-sm mt-2 flex items-start gap-1">
                                        {theater.address || `${theater.city} Area`}
                                    </p>
                                </div>
                                <div className="md:w-2/3 flex flex-wrap gap-4 items-center">
                                    {showsByTheater[theater.id].map(show => {
                                        const timeStr = new Date(show.show_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                        return (
                                            <button 
                                                key={show.id}
                                                onClick={() => navigate(`/seat-layout/${show.id}`)}
                                                className="px-6 py-3 border border-gray-600 rounded text-green-400 hover:bg-green-400/10 hover:border-green-400 transition cursor-pointer flex flex-col items-center"
                                            >
                                                <span className="text-sm font-medium">{timeStr}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TheatersList;
