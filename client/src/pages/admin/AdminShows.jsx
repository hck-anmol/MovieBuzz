import React, { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { PlusIcon, Trash2, X } from 'lucide-react'

const AdminShows = () => {
    const [shows, setShows] = useState([])
    const [movies, setMovies] = useState([])
    const [theaters, setTheaters] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [saving, setSaving] = useState(false)
    const [form, setForm] = useState({ id: '', movie_id: '', theater_id: '', show_datetime: '', price: '' })

    const fetchData = async () => {
        try {
            const [showsRes, moviesRes, theatersRes] = await Promise.all([
                axios.get('/api/admin/shows'),
                axios.get('/api/admin/movies'),
                axios.get('/api/admin/theaters')
            ])
            setShows(showsRes.data)
            setMovies(moviesRes.data)
            setTheaters(theatersRes.data)
        } catch (e) {
            toast.error('Failed to load shows')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchData() }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            await axios.post('/api/admin/shows', form)
            toast.success('Show added!')
            setShowModal(false)
            setForm({ id: '', movie_id: '', theater_id: '', show_datetime: '', price: '' })
            fetchData()
        } catch (e) {
            toast.error(e.response?.data?.message || 'Failed to add show')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this show? All related bookings will be removed.')) return
        try {
            await axios.delete(`/api/admin/shows/${id}`)
            toast.success('Show deleted')
            fetchData()
        } catch (e) {
            toast.error('Failed to delete show')
        }
    }

    const inputClass = 'w-full px-3 py-2 bg-black/50 rounded-lg border border-gray-700 focus:outline-none focus:border-primary text-white text-sm'
    const labelClass = 'block mb-1 text-xs text-gray-400'

    return (
        <div>
            <div className='flex items-center justify-between mb-6'>
                <div>
                    <h1 className='text-2xl font-bold'>Shows</h1>
                    <p className='text-gray-400 text-sm mt-1'>{shows.length} shows scheduled</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className='flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dull transition rounded-lg text-sm font-medium'
                >
                    <PlusIcon className='w-4 h-4' /> Add Show
                </button>
            </div>

            {loading ? (
                <p className='text-gray-400'>Loading...</p>
            ) : (
                <div className='bg-white/5 border border-gray-300/10 rounded-xl overflow-hidden'>
                    <table className='w-full text-sm'>
                        <thead>
                            <tr className='border-b border-gray-300/10 text-gray-400'>
                                <th className='text-left px-4 py-3'>Show ID</th>
                                <th className='text-left px-4 py-3'>Movie</th>
                                <th className='text-left px-4 py-3'>Theater</th>
                                <th className='text-left px-4 py-3'>Date & Time</th>
                                <th className='text-left px-4 py-3'>Price</th>
                                <th className='text-left px-4 py-3'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shows.length === 0 ? (
                                <tr><td colSpan={5} className='px-4 py-10 text-center text-gray-500'>No shows found</td></tr>
                            ) : shows.map((show) => (
                                <tr key={show.id} className='border-b border-gray-300/5 hover:bg-white/5 transition'>
                                    <td className='px-4 py-3 font-mono text-gray-400 text-xs'>{show.id}</td>
                                    <td className='px-4 py-3 font-medium'>{show.movie_title || show.movie_id}</td>
                                    <td className='px-4 py-3 text-gray-400'>{show.theater_name || show.theater_id}</td>
                                    <td className='px-4 py-3 text-gray-400'>
                                        <div>{new Date(show.show_datetime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                                        <div className='text-xs text-gray-500'>{new Date(show.show_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                    </td>
                                    <td className='px-4 py-3 text-green-400 font-medium'>${parseFloat(show.price).toFixed(2)}</td>
                                    <td className='px-4 py-3'>
                                        <button
                                            onClick={() => handleDelete(show.id)}
                                            className='p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition'
                                        >
                                            <Trash2 className='w-4 h-4' />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add Show Modal */}
            {showModal && (
                <div className='fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
                    <div className='bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md'>
                        <div className='flex items-center justify-between p-6 border-b border-gray-700'>
                            <h2 className='text-lg font-bold'>Add New Show</h2>
                            <button onClick={() => setShowModal(false)} className='p-1 hover:bg-white/10 rounded-lg transition'>
                                <X className='w-5 h-5' />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className='p-6 flex flex-col gap-4'>
                            <div>
                                <label className={labelClass}>Show ID (unique)</label>
                                <input name='id' value={form.id} onChange={e => setForm(p => ({ ...p, id: e.target.value }))} required className={inputClass} placeholder='e.g. show_100' />
                            </div>
                            <div>
                                <label className={labelClass}>Movie *</label>
                                <select name='movie_id' value={form.movie_id} onChange={e => setForm(p => ({ ...p, movie_id: e.target.value }))} required className={inputClass}>
                                    <option value=''>Select a movie</option>
                                    {movies.map(m => (
                                        <option key={m.id} value={m.id}>{m.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Theater *</label>
                                <select name='theater_id' value={form.theater_id} onChange={e => setForm(p => ({ ...p, theater_id: e.target.value }))} required className={inputClass}>
                                    <option value=''>Select a theater</option>
                                    {theaters.map(t => (
                                        <option key={t.id} value={t.id}>{t.name} ({t.city})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Date & Time *</label>
                                <input name='show_datetime' type='datetime-local' value={form.show_datetime} onChange={e => setForm(p => ({ ...p, show_datetime: e.target.value }))} required className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Ticket Price ($) *</label>
                                <input name='price' type='number' step='0.01' min='0' value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} required className={inputClass} placeholder='e.g. 12.99' />
                            </div>
                            <div className='flex gap-3 justify-end mt-2'>
                                <button type='button' onClick={() => setShowModal(false)} className='px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition'>Cancel</button>
                                <button type='submit' disabled={saving} className='px-5 py-2 bg-primary hover:bg-primary-dull rounded-lg text-sm font-medium transition disabled:opacity-50'>
                                    {saving ? 'Saving...' : 'Add Show'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminShows