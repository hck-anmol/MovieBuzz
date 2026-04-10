import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import BlurCircle from '../components/BlurCircle';
import toast from 'react-hot-toast';

const SeatLayout = () => {
  const { id, date } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);
  const [showDetails, setShowDetails] = useState(null);
  
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Demo Seat generation (5 rows, 8 columns)
  const rows = ['A', 'B', 'C', 'D', 'E'];
  const cols = [1, 2, 3, 4, 5, 6, 7, 8];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: movieData } = await axios.get(`/api/movies/${id}`);
        setMovie(movieData);
        
        const { data: showsData } = await axios.get(`/api/shows?movie_id=${id}&date=${date}`);
        setShows(showsData);
        
        if (showsData.length > 0) {
            handleSelectShow(showsData[0].id);
        } else {
            setLoading(false);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [id, date]);

  const handleSelectShow = async (showId) => {
      setSelectedShow(showId);
      setSelectedSeats([]);
      try {
          const { data } = await axios.get(`/api/shows/${showId}`);
          setShowDetails(data);
          setLoading(false);
      } catch (error) {
          console.error(error);
          setLoading(false);
      }
  }

  const toggleSeat = (seatId) => {
    if (showDetails?.occupiedSeats?.includes(seatId)) return;
    
    if (selectedSeats.includes(seatId)) {
        setSelectedSeats(prev => prev.filter(s => s !== seatId));
    } else {
        setSelectedSeats(prev => [...prev, seatId]);
    }
  };

  const handleBook = async () => {
      if (!user) {
          toast.error('Please login to book tickets');
          return navigate('/login');
      }
      if (selectedSeats.length === 0) {
          return toast.error('Please select at least one seat');
      }
      
      const amount = selectedSeats.length * showDetails.price;
      
      try {
          await axios.post('/api/bookings', {
              showId: selectedShow,
              seats: selectedSeats,
              amount: amount
          });
          toast.success('Booking Successful!');
          navigate('/my-bookings');
      } catch (error) {
          console.error(error);
          toast.error(error.response?.data?.message || 'Booking failed');
      }
  };

  if (loading) return <div className='flex justify-center items-center h-screen'>Loading...</div>;

  return (
    <div className='px-6 md:px-16 lg:px-40 py-30 mb-20 min-h-[80vh] relative'>
       <BlurCircle top='-5%' left='-5%' />
       <BlurCircle bottom='10%' right='-5%' />
       
       <h1 className='text-3xl font-bold mb-2'>{movie?.title}</h1>
       <p className='text-gray-400 mb-8'>Date: {new Date(date).toLocaleDateString()}</p>
       
       {shows.length === 0 ? (
           <p>No shows available for this date.</p>
       ) : (
           <div className='flex flex-col lg:flex-row gap-12'>
                {/* Seat Selection Area */}
                <div className='flex-1'>
                    <div className='flex gap-4 mb-8 overflow-x-auto pb-2'>
                        {shows.map(show => {
                            const timeStr = new Date(show.show_datetime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                            return (
                                <button 
                                    key={show.id} 
                                    onClick={() => handleSelectShow(show.id)}
                                    className={`px-6 py-2 rounded-lg border whitespace-nowrap transition cursor-pointer ${selectedShow === show.id ? 'bg-primary border-primary text-white' : 'border-gray-600 text-gray-300 hover:border-primary'}`}
                                >
                                    {timeStr}
                                </button>
                            )
                        })}
                    </div>
                    
                    {showDetails && (
                        <div className='bg-white/5 border border-gray-300/20 rounded-xl p-8 flex flex-col items-center mt-6'>
                            <div className='w-3/4 h-2 bg-gradient-to-r from-transparent via-primary to-transparent blur-[1px] mb-8 rounded-full shadow-[0_0_15px_rgba(230,57,70,0.8)]'></div>
                            <p className='text-xs text-gray-400 mb-10 tracking-[1em] uppercase'>Screen</p>
                            
                            <div className='flex flex-col gap-4'>
                                {rows.map(row => (
                                    <div key={row} className='flex gap-4 items-center'>
                                        <span className='w-6 text-center text-gray-400 font-medium'>{row}</span>
                                        <div className='flex gap-4'>
                                            {cols.map(col => {
                                                const seatId = `${row}${col}`;
                                                const isOccupied = showDetails.occupiedSeats?.includes(seatId);
                                                const isSelected = selectedSeats.includes(seatId);
                                                
                                                let seatClass = 'w-8 h-8 rounded-t-lg rounded-b-sm cursor-pointer transition-all ';
                                                if (isOccupied) {
                                                    seatClass += 'bg-gray-700 cursor-not-allowed';
                                                } else if (isSelected) {
                                                    seatClass += 'bg-primary scale-110';
                                                } else {
                                                    seatClass += 'bg-white/20 hover:bg-white/40';
                                                }
                                                
                                                return (
                                                    <div 
                                                        key={seatId} 
                                                        onClick={() => toggleSeat(seatId)}
                                                        className={seatClass}
                                                        title={seatId}
                                                    ></div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className='flex gap-8 mt-12 text-sm text-gray-300'>
                                <div className='flex items-center gap-2'><div className='w-4 h-4 bg-white/20 rounded-t-sm'></div> Available</div>
                                <div className='flex items-center gap-2'><div className='w-4 h-4 bg-primary rounded-t-sm'></div> Selected</div>
                                <div className='flex items-center gap-2'><div className='w-4 h-4 bg-gray-700 rounded-t-sm'></div> Occupied</div>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Summary Sidebar */}
                {showDetails && (
                    <div className='w-full lg:w-1/3'>
                         <div className='bg-white/10 p-6 border border-gray-300/20 rounded-xl backdrop-blur-md'>
                              <h3 className='text-xl font-semibold mb-4 border-b border-gray-300/20 pb-4'>Booking Summary</h3>
                              <div className='flex justify-between text-gray-300 mb-2'>
                                  <span>Price per ticket</span>
                                  <span>${showDetails.price}</span>
                              </div>
                              <div className='flex justify-between text-gray-300 mb-6'>
                                  <span>Selected Seats ({selectedSeats.length})</span>
                                  <span>{selectedSeats.join(', ') || '-'}</span>
                              </div>
                              <div className='flex justify-between text-white text-lg font-bold border-t border-gray-300/20 pt-4 mb-8'>
                                  <span>Total Amount</span>
                                  <span>${(showDetails.price * selectedSeats.length).toFixed(2)}</span>
                              </div>
                              
                              <button 
                                onClick={handleBook}
                                disabled={selectedSeats.length === 0}
                                className={`w-full py-3 rounded-lg font-medium transition cursor-pointer ${selectedSeats.length > 0 ? 'bg-primary hover:bg-primary-dull text-white' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
                              >
                                  Confirm Booking
                              </button>
                         </div>
                    </div>
                )}
           </div>
       )}
    </div>
  )
}

export default SeatLayout