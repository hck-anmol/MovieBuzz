import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCity } from '../context/CityContext';
import { useNavigate } from 'react-router-dom';
import BlurCircle from '../components/BlurCircle';

const TheatersByCity = () => {
    const { city } = useCity();
    const navigate = useNavigate();
    const [theaters, setTheaters] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTheaters = async () => {
            if (!city) {
                setLoading(false);
                return;
            }
            try {
                const { data } = await axios.get('/api/theaters', { params: { city } });
                setTheaters(data);
            } catch (error) {
                console.error("Failed to load theaters", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTheaters();
    }, [city]);

    if (!city) {
        return (
            <div className='px-6 md:px-16 lg:px-40 py-30 min-h-[80vh] flex flex-col items-center justify-center relative'>
                <BlurCircle top='10%' left='-5%' />
                <h1 className='text-3xl font-bold mb-4'>Select a City</h1>
                <p className='text-gray-400'>Please select a city to see all available theaters.</p>
            </div>
        );
    }

    return (
        <div className='px-6 md:px-16 lg:px-40 py-30 min-h-[80vh] relative'>
            <BlurCircle top='-5%' left='-5%' />
            <BlurCircle bottom='10%' right='-5%' />

            <h1 className='text-3xl font-bold mb-2'>Theaters in {city}</h1>
            <p className='text-gray-400 mb-10'>Browse movies and show times at your favorite local cinemas.</p>

            {loading ? (
                <div className='flex gap-4 items-center'><span className='loader border-4 border-primary border-t-transparent rounded-full w-6 h-6 animate-spin'></span> Loading theaters...</div>
            ) : theaters.length === 0 ? (
                <div className='bg-white/5 border border-white/10 rounded-xl p-8 text-center'>
                    <h2 className='text-xl mb-2'>No Theaters Found</h2>
                    <p className='text-gray-400'>We couldn't find any theaters running shows in {city}. Try another city.</p>
                </div>
            ) : (
                <div className='grid gap-6'>
                    {theaters.map((theater) => (
                        <div 
                            key={theater.id} 
                            onClick={() => navigate(`/theaters/${theater.id}`)}
                            className='bg-white/5 border border-white/10 hover:border-primary/50 transition-all rounded-xl p-6 cursor-pointer flex flex-col md:flex-row gap-6 hover:-translate-y-1'
                        >
                            <div className='w-full md:w-32 h-32 bg-black/40 rounded-lg flex items-center justify-center font-bold text-2xl text-primary border border-gray-800 shadow-inner'>
                                {theater.name.charAt(0)}
                            </div>
                            <div className='flex flex-col justify-center'>
                                <h3 className='text-xl font-bold text-white mb-2'>{theater.name}</h3>
                                <p className='text-sm text-gray-400'>{theater.address || `${theater.city} Local Cinema`}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TheatersByCity;
