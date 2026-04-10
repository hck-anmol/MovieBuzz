import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Film, Ticket, Users, DollarSign, TrendingUp, Calendar } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const AdminDashboard = () => {
    const navigate = useNavigate()
    const [stats, setStats] = useState({ movies: 0, shows: 0, bookings: 0, revenue: 0, users: 0 })
    const [recentBookings, setRecentBookings] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [moviesRes, showsRes, bookingsRes] = await Promise.all([
                    axios.get('/api/admin/movies'),
                    axios.get('/api/admin/shows'),
                    axios.get('/api/admin/bookings'),
                ])
                const revenue = bookingsRes.data.reduce((sum, b) => sum + parseFloat(b.amount || 0), 0)
                setStats({
                    movies: moviesRes.data.length,
                    shows: showsRes.data.length,
                    bookings: bookingsRes.data.length,
                    revenue: revenue.toFixed(2),
                })
                setRecentBookings(bookingsRes.data.slice(0, 6))
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    const statCards = [
        { label: 'Total Movies', value: stats.movies, icon: Film, color: 'text-blue-400', bg: 'bg-blue-400/10', path: '/admin/movies' },
        { label: 'Active Shows', value: stats.shows, icon: Calendar, color: 'text-purple-400', bg: 'bg-purple-400/10', path: '/admin/shows' },
        { label: 'Total Bookings', value: stats.bookings, icon: Ticket, color: 'text-green-400', bg: 'bg-green-400/10', path: '/admin/bookings' },
        { label: 'Total Revenue', value: `$${stats.revenue}`, icon: DollarSign, color: 'text-primary', bg: 'bg-primary/10', path: '/admin/bookings' },
    ]

    return (
        <div>
            <div className='mb-8'>
                <h1 className='text-2xl font-bold'>Dashboard</h1>
                <p className='text-gray-400 text-sm mt-1'>Welcome back, Admin</p>
            </div>

            {loading ? (
                <p className='text-gray-400'>Loading stats...</p>
            ) : (
                <>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10'>
                        {statCards.map((card) => (
                            <div
                                key={card.label}
                                onClick={() => navigate(card.path)}
                                className='bg-white/5 border border-gray-300/10 rounded-xl p-5 flex items-center gap-4 hover:bg-white/10 transition cursor-pointer'
                            >
                                <div className={`${card.bg} p-3 rounded-lg`}>
                                    <card.icon className={`w-6 h-6 ${card.color}`} />
                                </div>
                                <div>
                                    <p className='text-2xl font-bold'>{card.value}</p>
                                    <p className='text-gray-400 text-xs'>{card.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div>
                        <h2 className='text-lg font-semibold mb-4 flex items-center gap-2'>
                            <TrendingUp className='w-5 h-5 text-primary' /> Recent Bookings
                        </h2>
                        <div className='bg-white/5 border border-gray-300/10 rounded-xl overflow-hidden'>
                            <table className='w-full text-sm'>
                                <thead>
                                    <tr className='border-b border-gray-300/10 text-gray-400'>
                                        <th className='text-left px-4 py-3'>ID</th>
                                        <th className='text-left px-4 py-3'>Movie</th>
                                        <th className='text-left px-4 py-3'>Show Date</th>
                                        <th className='text-left px-4 py-3'>Amount</th>
                                        <th className='text-left px-4 py-3'>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentBookings.length === 0 ? (
                                        <tr><td colSpan={5} className='px-4 py-6 text-center text-gray-500'>No bookings yet</td></tr>
                                    ) : recentBookings.map((b) => (
                                        <tr key={b.id} className='border-b border-gray-300/5 hover:bg-white/5 transition'>
                                            <td className='px-4 py-3 font-mono text-gray-400'>#{b.id}</td>
                                            <td className='px-4 py-3 font-medium'>{b.title}</td>
                                            <td className='px-4 py-3 text-gray-400'>{new Date(b.show_datetime).toLocaleDateString()}</td>
                                            <td className='px-4 py-3 text-green-400 font-medium'>${parseFloat(b.amount).toFixed(2)}</td>
                                            <td className='px-4 py-3'>
                                                <span className='bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full text-xs'>Confirmed</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default AdminDashboard