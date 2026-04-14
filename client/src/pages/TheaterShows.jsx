import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import BlurCircle from '../components/BlurCircle';

const TheaterShows = () => {
    const { theaterId } = useParams();
    const navigate = useNavigate();
    const [theater, setTheater] = useState(null);
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTheaterAndShows = async () => {
            try {
                const { data: tData } = await axios.get(`/api/theaters/${theaterId}`);
                setTheater(tData);

                const { data: sData } = await axios.get(`/api/shows?theater_id=${theaterId}`);
                
                // Group by movie
                const grouped = sData.reduce((acc, show) => {
                    const key = show.movie_title || show.movie_id;
                    if (!acc[key]) acc[key] = { poster: show.poster_path, shows: [] };
                    acc[key].shows.push(show);
                    return acc;
                }, {});

                setShows(grouped);
            } catch (error) {
                console.error("Failed to load theater shows", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTheaterAndShows();
    }, [theaterId]);

    return (
        <div className='px-6 md:px-16 lg:px-40 py-30 min-h-[80vh] relative'>
            <BlurCircle top='-5%' left='-5%' />
            <BlurCircle bottom='10%' right='-5%' />

            {loading ? (
                <p>Loading...</p>
            ) : !theater ? (
                <p>Theater not found.</p>
            ) : (
                <>
                    <h1 className='text-3xl font-bold mb-2 text-primary'>{theater.name}</h1>
                    <p className='text-gray-400 mb-10'>Address: {theater.address || theater.city}</p>

                    {Object.keys(shows).length === 0 ? (
                        <p className='text-gray-400'>No shows are currently scheduled here.</p>
                    ) : (
                        <div className='grid gap-8'>
                            {Object.entries(shows).map(([title, data]) => (
                                <div key={title} className='bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col md:flex-row gap-6'>
                                    {data.poster ? (
                                        <img src={data.poster} alt={title} className='w-full md:w-32 h-44 object-cover rounded shadow-lg' />
                                    ) : (
                                        <div className='w-full md:w-32 h-44 bg-gray-800 rounded flex items-center justify-center text-xs text-center p-2 text-gray-500'>No Poster</div>
                                    )}
                                    <div className='flex-1'>
                                        <h3 className='text-xl font-bold mb-4'>{title}</h3>
                                        <div className='flex flex-wrap gap-4'>
                                            {data.shows.map(show => {
                                                const showDate = new Date(show.show_datetime);
                                                // Check if it's past or future
                                                return (
                                                    <button 
                                                        key={show.id}
                                                        onClick={() => navigate(`/seat-layout/${show.id}`)}
                                                        className='px-5 py-2 border border-primary/50 text-white rounded-lg hover:bg-primary transition cursor-pointer text-sm flex flex-col items-center shadow shadow-primary/10'
                                                    >
                                                        <span className='font-bold text-white'>{showDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                        <span className='text-[10px] text-gray-300'>{showDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default TheaterShows;
