import { MenuIcon, SearchIcon, TicketPlus, XIcon, ShieldCheck } from 'lucide-react'
import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCity } from '../context/CityContext'
import CitySelectorModal from './CitySelectorModal'
import { MapPin } from 'lucide-react'

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isCityModalOpen, setIsCityModalOpen] = useState(false);
    const { user, logout } = useAuth();
    const { city } = useCity();
    const navigate = useNavigate();

    return (
        <div className='fixed top-0 left-0 z-50 w-full flex items-center 
            justify-between px-6 md:px-16 lg:px-36 py-5'>
            <Link to='/' className='max-md:flex-1'>
                <img src={assets.logo} alt='' className='w-36 h-auto' />
            </Link>
            <div className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium
             max-md:text-lg z-50 flex flex-col md:flex-row items-center max-md:justify-center 
                 gap-8 min-md:px-8 max-md:h-screen min-md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border
                 border-gray-300/20 overflow-hidden transition-[width] duration-300 h-10 ${isOpen ? 'max-md:w-full' : 'max-md:w-0'}`}>
                <XIcon className='md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer' onClick={() => setIsOpen(!isOpen)} />
                <Link to='/' onClick={() => { scrollTo(0, 0); setIsOpen(false) }}>Home</Link>
                <Link to='/movies' onClick={() => { scrollTo(0, 0); setIsOpen(false) }}>Movies</Link>
                <Link to='/' onClick={() => { scrollTo(0, 0); setIsOpen(false) }}>Theaters</Link>
                <Link to='/' onClick={() => { scrollTo(0, 0); setIsOpen(false) }}>Releases</Link>
                <Link to='/favorites' onClick={() => { scrollTo(0, 0); setIsOpen(false) }}>Favorites</Link>
            </div>
            <div className='flex items-center gap-6'>
                <button 
                    onClick={() => setIsCityModalOpen(true)} 
                    className="max-md:hidden flex items-center gap-2 text-sm text-gray-300 hover:text-white transition cursor-pointer"
                >
                    <MapPin className="w-5 h-5 text-primary" />
                    {city ? city.substring(0, 15) : 'Select City'}
                </button>
                <SearchIcon className='max-md:hidden w-6 h-6 cursor-pointer' />
                {
                    !user ? (
                        <button onClick={() => navigate('/login')} className='px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer'>Login</button>
                    ) : (
                        <div className="relative group z-50 hover:cursor-pointer pb-2 -mb-2">
                            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white cursor-pointer select-none font-bold">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="absolute right-0 mt-2 w-52 bg-white text-black rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col overflow-hidden">
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <p className='text-sm font-semibold truncate'>{user.name}</p>
                                    <p className='text-xs text-gray-500 truncate'>{user.email}</p>
                                </div>
                                <button className="px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-sm" onClick={() => navigate('/my-bookings')}>
                                    <TicketPlus width={15}/> My Bookings
                                </button>
                                {user?.role === 'admin' && (
                                    <button className="px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-sm text-purple-600" onClick={() => navigate('/admin')}>
                                        <ShieldCheck width={15}/> Admin Panel
                                    </button>
                                )}
                                <button className="px-4 py-2 text-left hover:bg-gray-100 text-red-600 text-sm" onClick={logout}>Logout</button>
                            </div>
                        </div>
                    )
                }
            </div>
            <MenuIcon className='max-md:ml-4 md:hidden w-8 h-8 cursor-pointer' onClick={() => setIsOpen(!isOpen)} />
            
            <CitySelectorModal 
                isOpen={isCityModalOpen} 
                onClose={() => setIsCityModalOpen(false)} 
            />
        </div>
    )
}

export default Navbar