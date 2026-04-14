import React, { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { PlusIcon, Trash2, X } from 'lucide-react'

const AdminTheaters = () => {
    const [theaters, setTheaters] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [saving, setSaving] = useState(false)
    const [form, setForm] = useState({ id: '', name: '', city: '', address: '' })

    const fetchData = async () => {
        try {
            const { data } = await axios.get('/api/admin/theaters')
            setTheaters(data)
        } catch (e) {
            toast.error('Failed to load theaters')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchData() }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            await axios.post('/api/admin/theaters', form)
            toast.success('Theater added!')
            setShowModal(false)
            setForm({ id: '', name: '', city: '', address: '' })
            fetchData()
        } catch (e) {
            toast.error(e.response?.data?.message || 'Failed to add theater')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this theater? All related shows and bookings will be removed.')) return
        try {
            await axios.delete(`/api/admin/theaters/${id}`)
            toast.success('Theater deleted')
            fetchData()
        } catch (e) {
            toast.error('Failed to delete theater')
        }
    }

    const inputClass = 'w-full px-3 py-2 bg-black/50 rounded-lg border border-gray-700 focus:outline-none focus:border-primary text-white text-sm'
    const labelClass = 'block mb-1 text-xs text-gray-400'

    return (
        <div>
            <div className='flex items-center justify-between mb-6'>
                <div>
                    <h1 className='text-2xl font-bold'>Theaters</h1>
                    <p className='text-gray-400 text-sm mt-1'>{theaters.length} theaters listed</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className='flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dull transition rounded-lg text-sm font-medium'
                >
                    <PlusIcon className='w-4 h-4' /> Add Theater
                </button>
            </div>

            {loading ? (
                <p className='text-gray-400'>Loading...</p>
            ) : (
                <div className='bg-white/5 border border-gray-300/10 rounded-xl overflow-hidden'>
                    <table className='w-full text-sm'>
                        <thead>
                            <tr className='border-b border-gray-300/10 text-gray-400'>
                                <th className='text-left px-4 py-3'>ID</th>
                                <th className='text-left px-4 py-3'>Name</th>
                                <th className='text-left px-4 py-3'>City</th>
                                <th className='text-left px-4 py-3'>Address</th>
                                <th className='text-left px-4 py-3'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {theaters.length === 0 ? (
                                <tr><td colSpan={5} className='px-4 py-10 text-center text-gray-500'>No theaters found</td></tr>
                            ) : theaters.map((theater) => (
                                <tr key={theater.id} className='border-b border-gray-300/5 hover:bg-white/5 transition'>
                                    <td className='px-4 py-3 font-mono text-gray-400 text-xs'>{theater.id}</td>
                                    <td className='px-4 py-3 font-medium'>{theater.name}</td>
                                    <td className='px-4 py-3'>{theater.city}</td>
                                    <td className='px-4 py-3 text-gray-400'>{theater.address || '-'}</td>
                                    <td className='px-4 py-3'>
                                        <button
                                            onClick={() => handleDelete(theater.id)}
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

            {/* Add Theater Modal */}
            {showModal && (
                <div className='fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
                    <div className='bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md'>
                        <div className='flex items-center justify-between p-6 border-b border-gray-700'>
                            <h2 className='text-lg font-bold'>Add New Theater</h2>
                            <button onClick={() => setShowModal(false)} className='p-1 hover:bg-white/10 rounded-lg transition'>
                                <X className='w-5 h-5' />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className='p-6 flex flex-col gap-4'>
                            <div>
                                <label className={labelClass}>Theater ID (unique)</label>
                                <input name='id' value={form.id} onChange={e => setForm(p => ({ ...p, id: e.target.value }))} required className={inputClass} placeholder='e.g. imax_123' />
                            </div>
                            <div>
                                <label className={labelClass}>Theater Name *</label>
                                <input name='name' value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required className={inputClass} placeholder='e.g. INOX' />
                            </div>
                            <div>
                                <label className={labelClass}>City *</label>
                                <input name='city' value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} required className={inputClass} placeholder='e.g. Mumbai' />
                            </div>
                            <div>
                                <label className={labelClass}>Address / Location</label>
                                <input name='address' value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} className={inputClass} placeholder='e.g. 5th Ave Mall' />
                            </div>
                            <div className='flex gap-3 justify-end mt-2'>
                                <button type='button' onClick={() => setShowModal(false)} className='px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition'>Cancel</button>
                                <button type='submit' disabled={saving} className='px-5 py-2 bg-primary hover:bg-primary-dull rounded-lg text-sm font-medium transition disabled:opacity-50'>
                                    {saving ? 'Saving...' : 'Add Theater'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminTheaters
