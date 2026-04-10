import React, { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Ticket, CalendarIcon, ClockIcon, Banknote } from 'lucide-react'

const AdminBookings = () => {
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const { data } = await axios.get('/api/admin/bookings')
                setBookings(data)
            } catch (e) {
                toast.error('Failed to load bookings')
            } finally {
                setLoading(false)
            }
        }
        fetchBookings()
    }, [])

    const filtered = bookings.filter(b =>
        b.title?.toLowerCase().includes(search.toLowerCase()) ||
        String(b.id).includes(search) ||
        b.user_name?.toLowerCase().includes(search.toLowerCase())
    )

    const totalRevenue = bookings.reduce((sum, b) => sum + parseFloat(b.amount || 0), 0)

    return (
        <div>
            <div className='mb-6'>
                <h1 className='text-2xl font-bold'>Bookings</h1>
                <p className='text-gray-400 text-sm mt-1'>
                    {bookings.length} total bookings · Total revenue: <span className='text-green-400 font-semibold'>${totalRevenue.toFixed(2)}</span>
                </p>
            </div>

            <input
                type='text'
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder='Search by movie, booking ID, or user...'
                className='w-full max-w-md px-4 py-2 bg-white/5 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary mb-6'
            />

            {loading ? (
                <p className='text-gray-400'>Loading...</p>
            ) : filtered.length === 0 ? (
                <div className='text-center py-20 bg-white/5 border border-gray-300/10 rounded-xl'>
                    <Ticket className='w-12 h-12 mx-auto text-gray-600 mb-3' />
                    <p className='text-gray-400'>No bookings found</p>
                </div>
            ) : (
                <div className='bg-white/5 border border-gray-300/10 rounded-xl overflow-hidden'>
                    <table className='w-full text-sm'>
                        <thead>
                            <tr className='border-b border-gray-300/10 text-gray-400'>
                                <th className='text-left px-4 py-3'>ID</th>
                                <th className='text-left px-4 py-3'>Movie</th>
                                <th className='text-left px-4 py-3 max-md:hidden'>User</th>
                                <th className='text-left px-4 py-3 max-md:hidden'>Show</th>
                                <th className='text-left px-4 py-3'>Seats</th>
                                <th className='text-left px-4 py-3'>Amount</th>
                                <th className='text-left px-4 py-3'>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((b) => {
                                const showDate = new Date(b.show_datetime)
                                return (
                                    <tr key={b.id} className='border-b border-gray-300/5 hover:bg-white/5 transition'>
                                        <td className='px-4 py-3 font-mono text-gray-400 text-xs'>#{b.id}</td>
                                        <td className='px-4 py-3'>
                                            <div className='flex items-center gap-2'>
                                                {b.poster_path && <img src={b.poster_path} alt='' className='w-8 h-11 object-cover rounded' />}
                                                <span className='font-medium'>{b.title}</span>
                                            </div>
                                        </td>
                                        <td className='px-4 py-3 text-gray-400 max-md:hidden'>{b.user_name || `User #${b.user_id}`}</td>
                                        <td className='px-4 py-3 text-gray-400 max-md:hidden'>
                                            <div className='flex items-center gap-1 text-xs'>
                                                <CalendarIcon className='w-3 h-3' />
                                                {showDate.toLocaleDateString()}
                                            </div>
                                            <div className='flex items-center gap-1 text-xs text-gray-500 mt-0.5'>
                                                <ClockIcon className='w-3 h-3' />
                                                {showDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                        <td className='px-4 py-3 text-gray-300 text-xs max-w-[120px] truncate'>{b.bookedSeats?.join(', ') || '-'}</td>
                                        <td className='px-4 py-3 text-green-400 font-medium flex items-center gap-1'>
                                            <Banknote className='w-3.5 h-3.5' />${parseFloat(b.amount).toFixed(2)}
                                        </td>
                                        <td className='px-4 py-3'>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${b.is_paid ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                                {b.is_paid ? 'Paid' : 'Pending'}
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default AdminBookings