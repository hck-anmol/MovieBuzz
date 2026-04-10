import React, { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { PlusIcon, Trash2, X, Film } from 'lucide-react'

const defaultForm = {
    id: '', title: '', overview: '', poster_path: '', backdrop_path: '',
    release_date: '', original_language: 'en', tagline: '', vote_average: '',
    vote_count: '', runtime: '', genres: '', casts: ''
}

const AdminMovies = () => {
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [form, setForm] = useState(defaultForm)
    const [saving, setSaving] = useState(false)

    const fetchMovies = async () => {
        try {
            const { data } = await axios.get('/api/admin/movies')
            setMovies(data)
        } catch (e) {
            toast.error('Failed to load movies')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchMovies() }, [])

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            // Parse genres and casts from comma-separated strings
            const payload = {
                ...form,
                vote_average: parseFloat(form.vote_average) || 0,
                vote_count: parseInt(form.vote_count) || 0,
                runtime: parseInt(form.runtime) || 0,
                genres: form.genres.split(',').map(g => ({ name: g.trim() })).filter(g => g.name),
                casts: form.casts.split(',').map(name => ({ name: name.trim(), profile_path: '' })).filter(c => c.name),
            }
            await axios.post('/api/admin/movies', payload)
            toast.success('Movie added!')
            setShowModal(false)
            setForm(defaultForm)
            fetchMovies()
        } catch (e) {
            toast.error(e.response?.data?.message || 'Failed to add movie')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this movie? All its shows and bookings will be removed.')) return
        try {
            await axios.delete(`/api/admin/movies/${id}`)
            toast.success('Movie deleted')
            fetchMovies()
        } catch (e) {
            toast.error('Failed to delete movie')
        }
    }

    const inputClass = 'w-full px-3 py-2 bg-black/50 rounded-lg border border-gray-700 focus:outline-none focus:border-primary text-white text-sm'
    const labelClass = 'block mb-1 text-xs text-gray-400'

    return (
        <div>
            <div className='flex items-center justify-between mb-6'>
                <div>
                    <h1 className='text-2xl font-bold'>Movies</h1>
                    <p className='text-gray-400 text-sm mt-1'>{movies.length} movies in database</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className='flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dull transition rounded-lg text-sm font-medium'
                >
                    <PlusIcon className='w-4 h-4' /> Add Movie
                </button>
            </div>

            {loading ? (
                <p className='text-gray-400'>Loading...</p>
            ) : (
                <div className='bg-white/5 border border-gray-300/10 rounded-xl overflow-hidden'>
                    <table className='w-full text-sm'>
                        <thead>
                            <tr className='border-b border-gray-300/10 text-gray-400'>
                                <th className='text-left px-4 py-3'>Movie</th>
                                <th className='text-left px-4 py-3 max-md:hidden'>Genre</th>
                                <th className='text-left px-4 py-3 max-md:hidden'>Year</th>
                                <th className='text-left px-4 py-3 max-md:hidden'>Rating</th>
                                <th className='text-left px-4 py-3'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movies.length === 0 ? (
                                <tr><td colSpan={5} className='px-4 py-10 text-center text-gray-500'>No movies found</td></tr>
                            ) : movies.map((movie) => (
                                <tr key={movie.id} className='border-b border-gray-300/5 hover:bg-white/5 transition'>
                                    <td className='px-4 py-3'>
                                        <div className='flex items-center gap-3'>
                                            {movie.poster_path ? (
                                                <img src={movie.poster_path} alt='' className='w-10 h-14 object-cover rounded' />
                                            ) : (
                                                <div className='w-10 h-14 bg-gray-700 rounded flex items-center justify-center'>
                                                    <Film className='w-4 h-4 text-gray-500' />
                                                </div>
                                            )}
                                            <div>
                                                <p className='font-medium'>{movie.title}</p>
                                                <p className='text-gray-500 text-xs'>ID: {movie.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='px-4 py-3 text-gray-400 max-md:hidden'>
                                        {movie.genres?.slice(0, 2).map(g => g.name).join(', ')}
                                    </td>
                                    <td className='px-4 py-3 text-gray-400 max-md:hidden'>
                                        {movie.release_date?.split('-')[0]}
                                    </td>
                                    <td className='px-4 py-3 text-yellow-400 max-md:hidden'>
                                        ★ {movie.vote_average?.toFixed(1)}
                                    </td>
                                    <td className='px-4 py-3'>
                                        <button
                                            onClick={() => handleDelete(movie.id)}
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

            {/* Add Movie Modal */}
            {showModal && (
                <div className='fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
                    <div className='bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
                        <div className='flex items-center justify-between p-6 border-b border-gray-700'>
                            <h2 className='text-lg font-bold'>Add New Movie</h2>
                            <button onClick={() => setShowModal(false)} className='p-1 hover:bg-white/10 rounded-lg transition'>
                                <X className='w-5 h-5' />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className='p-6 grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='md:col-span-2'>
                                <label className={labelClass}>Movie ID (unique, e.g. 12345)</label>
                                <input name='id' value={form.id} onChange={handleChange} required className={inputClass} placeholder='e.g. 123456' />
                            </div>
                            <div className='md:col-span-2'>
                                <label className={labelClass}>Title *</label>
                                <input name='title' value={form.title} onChange={handleChange} required className={inputClass} placeholder='Movie title' />
                            </div>
                            <div className='md:col-span-2'>
                                <label className={labelClass}>Overview</label>
                                <textarea name='overview' value={form.overview} onChange={handleChange} rows={3} className={inputClass} placeholder='Movie description...' />
                            </div>
                            <div>
                                <label className={labelClass}>Poster URL</label>
                                <input name='poster_path' value={form.poster_path} onChange={handleChange} className={inputClass} placeholder='https://...' />
                            </div>
                            <div>
                                <label className={labelClass}>Backdrop URL</label>
                                <input name='backdrop_path' value={form.backdrop_path} onChange={handleChange} className={inputClass} placeholder='https://...' />
                            </div>
                            <div>
                                <label className={labelClass}>Release Date</label>
                                <input name='release_date' type='date' value={form.release_date} onChange={handleChange} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Language</label>
                                <input name='original_language' value={form.original_language} onChange={handleChange} className={inputClass} placeholder='en' />
                            </div>
                            <div>
                                <label className={labelClass}>Runtime (minutes)</label>
                                <input name='runtime' type='number' value={form.runtime} onChange={handleChange} className={inputClass} placeholder='120' />
                            </div>
                            <div>
                                <label className={labelClass}>Rating (0-10)</label>
                                <input name='vote_average' type='number' step='0.1' min='0' max='10' value={form.vote_average} onChange={handleChange} className={inputClass} placeholder='7.5' />
                            </div>
                            <div>
                                <label className={labelClass}>Vote Count</label>
                                <input name='vote_count' type='number' value={form.vote_count} onChange={handleChange} className={inputClass} placeholder='10000' />
                            </div>
                            <div>
                                <label className={labelClass}>Tagline</label>
                                <input name='tagline' value={form.tagline} onChange={handleChange} className={inputClass} placeholder='Tagline...' />
                            </div>
                            <div className='md:col-span-2'>
                                <label className={labelClass}>Genres (comma separated, e.g. Action, Thriller)</label>
                                <input name='genres' value={form.genres} onChange={handleChange} className={inputClass} placeholder='Action, Thriller, Drama' />
                            </div>
                            <div className='md:col-span-2'>
                                <label className={labelClass}>Cast Names (comma separated)</label>
                                <input name='casts' value={form.casts} onChange={handleChange} className={inputClass} placeholder='Actor One, Actor Two' />
                            </div>
                            <div className='md:col-span-2 flex gap-3 justify-end mt-2'>
                                <button type='button' onClick={() => setShowModal(false)} className='px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition'>
                                    Cancel
                                </button>
                                <button type='submit' disabled={saving} className='px-5 py-2 bg-primary hover:bg-primary-dull rounded-lg text-sm font-medium transition disabled:opacity-50'>
                                    {saving ? 'Saving...' : 'Add Movie'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminMovies