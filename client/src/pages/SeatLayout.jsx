import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import BlurCircle from '../components/BlurCircle';
import toast from 'react-hot-toast';
import PaymentModal from '../components/PaymentModal';

const SeatLayout = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  
  const [showDetails, setShowDetails] = useState(null);
  const [inviteDetails, setInviteDetails] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Seat generation (10 rows, 14 columns)
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const cols = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
          const { data } = await axios.get(`/api/shows/${showId}`);
          setShowDetails(data);
      } catch (error) {
          console.error(error);
          toast.error("Failed to load show details");
      }
    };
    
    const fetchInviteDetails = async () => {
      const inviteId = searchParams.get('invite');
      if (inviteId) {
          try {
              const { data } = await axios.get(`/api/bookings/invite/${inviteId}`);
              setInviteDetails(data);
          } catch (error) {
              console.error("Invite details not found", error);
          }
      }
    };
    
    Promise.all([fetchShowDetails(), fetchInviteDetails()]).then(() => setLoading(false));
  }, [showId, searchParams]);

  const toggleSeat = (seatId) => {
    if (showDetails?.occupiedSeats?.includes(seatId)) return;
    
    if (selectedSeats.includes(seatId)) {
        setSelectedSeats(prev => prev.filter(s => s !== seatId));
    } else {
        setSelectedSeats(prev => [...prev, seatId]);
    }
  };

  const initiateBooking = () => {
      if (!user) {
          toast.error('Please login to book tickets');
          return navigate('/login');
      }
      if (selectedSeats.length === 0) {
          return toast.error('Please select at least one seat');
      }
      setIsPaymentModalOpen(true);
  };

  const handleSuccessfulPayment = async () => {
      const amount = selectedSeats.length * showDetails.price;
      
      try {
          await axios.post('/api/bookings', {
              showId: showId,
              seats: selectedSeats,
              amount: amount
          });
          setIsPaymentModalOpen(false);
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
       
       <h1 className='text-3xl font-bold mb-2'>{showDetails?.movie_title}</h1>
       <p className='text-gray-400 mb-8 flex gap-4'>
           <span>Date: {new Date(showDetails?.show_datetime).toLocaleDateString()}</span>
           <span>Time: {new Date(showDetails?.show_datetime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
           <span>Theater: {showDetails?.theater_name || 'Cinepolis Default'}</span>
       </p>
       
       <div className='flex flex-col lg:flex-row gap-12'>
            {/* Seat Selection Area */}
            <div className='flex-1 overflow-x-auto pb-4'>
                 
                 {inviteDetails && (
                     <div className='bg-blue-500/20 border border-blue-500/50 p-4 rounded-xl mb-6 text-blue-200 flex items-center justify-between shadow-[0_0_15px_rgba(59,130,246,0.2)]'>
                         <div>
                             <h3 className='font-bold text-lg text-blue-400'>Your friend {inviteDetails.inviterName} invited you!</h3>
                             <p className='text-sm mt-1'>They are seated at <span className='font-bold'>{inviteDetails.bookedSeats.join(', ')}</span>.</p>
                         </div>
                         <div className='px-4 py-2 bg-blue-600/30 rounded-lg text-xs font-semibold'>
                             Pick seats near them!
                         </div>
                     </div>
                 )}
                
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
                                                const isFriendSeat = inviteDetails?.bookedSeats?.includes(seatId);
                                                const isOccupied = showDetails.occupiedSeats?.includes(seatId) && !isFriendSeat;
                                                const isSelected = selectedSeats.includes(seatId);
                                                
                                                let seatClass = 'w-8 h-8 rounded-t-lg rounded-b-sm cursor-pointer transition-all ';
                                                if (isFriendSeat) {
                                                    seatClass += 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)] animate-pulse cursor-not-allowed';
                                                } else if (isOccupied) {
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
                            
                            <div className='flex gap-8 mt-12 text-sm text-gray-300 flex-wrap justify-center'>
                                <div className='flex items-center gap-2'><div className='w-4 h-4 bg-white/20 rounded-t-sm'></div> Available</div>
                                <div className='flex items-center gap-2'><div className='w-4 h-4 bg-primary rounded-t-sm'></div> Selected</div>
                                <div className='flex items-center gap-2'><div className='w-4 h-4 bg-gray-700 rounded-t-sm'></div> Occupied</div>
                                {inviteDetails && (
                                    <div className='flex items-center gap-2'><div className='w-4 h-4 bg-blue-500 rounded-t-sm'></div> Friend's Seats</div>
                                )}
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
                                  <span>₹{showDetails.price}</span>
                              </div>
                              <div className='flex justify-between text-gray-300 mb-6'>
                                  <span>Selected Seats ({selectedSeats.length})</span>
                                  <span>{selectedSeats.join(', ') || '-'}</span>
                              </div>
                              <div className='flex justify-between text-white text-lg font-bold border-t border-gray-300/20 pt-4 mb-8'>
                                  <span>Total Amount</span>
                                  <span>₹{(showDetails.price * selectedSeats.length).toFixed(2)}</span>
                              </div>
                              
                              <button 
                                onClick={initiateBooking}
                                disabled={selectedSeats.length === 0}
                                className={`w-full py-3 rounded-lg font-medium transition cursor-pointer shadow-lg shadow-primary/20 ${selectedSeats.length > 0 ? 'bg-primary hover:bg-primary-dull text-white' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
                              >
                                  Pay ₹{(showDetails.price * selectedSeats.length).toFixed(2)}
                              </button>
                         </div>
                    </div>
                )}
           </div>
           
           <PaymentModal 
              isOpen={isPaymentModalOpen}
              onClose={() => setIsPaymentModalOpen(false)}
              amount={(showDetails?.price * selectedSeats.length).toFixed(2)}
              onSuccessfulPayment={handleSuccessfulPayment}
           />
    </div>
  )
}

export default SeatLayout