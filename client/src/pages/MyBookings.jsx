import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import BlurCircle from '../components/BlurCircle';
import { CalendarIcon, ClockIcon, Ticket, Banknote } from 'lucide-react';

const MyBookings = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        }
    }, [user, loading, navigate]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const { data } = await axios.get('/api/bookings');
                setBookings(data);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        }
        if (user) {
            fetchBookings();
        }
    }, [user]);

    if (loading || isLoading) {
        return <div className='flex justify-center items-center px-6 md:px-16 lg:px-40 py-30 min-h-[80vh]'>Loading...</div>;
    }

    return (
        <div className='px-6 md:px-16 lg:px-40 py-30 min-h-[80vh] relative'>
            <BlurCircle top='-5%' left='-5%' />
            <BlurCircle bottom='20%' right='-5%' />
            
            <h1 className='text-3xl font-bold mb-10'>My Bookings</h1>
            
            {bookings.length === 0 ? (
                <div className='text-center py-20 px-6 bg-white/5 border border-gray-300/20 rounded-xl backdrop-blur-md'>
                    <Ticket className='w-16 h-16 mx-auto mb-4 text-gray-500' />
                    <h2 className='text-xl font-semibold mb-2'>No bookings found</h2>
                    <p className='text-gray-400 mb-6'>Looks like you haven't booked any movies yet.</p>
                    <button 
                        onClick={() => navigate('/movies')}
                        className='px-6 py-2 bg-primary hover:bg-primary-dull transition rounded text-white'
                    >
                        Browse Movies
                    </button>
                </div>
            ) : (
                <div className='grid gap-6'>
                    {bookings.map(booking => {
                        const showDate = new Date(booking.show_datetime);
                        return (
                            <div key={booking.id} className='bg-white/5 border border-gray-300/20 backdrop-blur-md rounded-xl p-6 flex flex-col md:flex-row gap-6 hover:-translate-y-1 transition-transform'>
                                <img 
                                    src={booking.poster_path} 
                                    alt={booking.title} 
                                    className='w-full md:w-32 h-48 object-cover rounded shadow-lg'
                                />
                                <div className='flex-1 flex flex-col justify-between'>
                                    <div>
                                        <div className='flex justify-between items-start mb-2'>
                                            <h2 className='text-2xl font-semibold'>{booking.title}</h2>
                                            <span className='bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-semibold'>Confirmed</span>
                                        </div>
                                        <div className='flex flex-wrap gap-4 text-sm text-gray-300 mt-4'>
                                            <div className='flex items-center gap-2'>
                                                <CalendarIcon className='w-4 h-4 text-primary' />
                                                {showDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <ClockIcon className='w-4 h-4 text-primary' />
                                                {showDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 border-t border-gray-300/20 pt-4'>
                                        <div>
                                            <p className='text-xs text-gray-400 mb-1'>Booking ID</p>
                                            <p className='font-mono text-sm'>#{booking.id}</p>
                                        </div>
                                        <div>
                                            <p className='text-xs text-gray-400 mb-1'>Seats ({booking.bookedSeats.length})</p>
                                            <p className='font-medium'>{booking.bookedSeats.join(', ')}</p>
                                        </div>
                                        <div>
                                            <p className='text-xs text-gray-400 mb-1'>Amount</p>
                                            <p className='font-medium flex items-center gap-1'><Banknote className='w-4 h-4'/>${parseFloat(booking.amount).toFixed(2)}</p>
                                        </div>
                                        <div className='flex items-end md:justify-end'>
                                            <p className='text-xs text-green-400'>Paid</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default MyBookings