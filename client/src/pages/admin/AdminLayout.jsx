import React, { useState } from 'react'
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import { LayoutDashboard, Film, CalendarDays, Ticket, LogOut, Menu, X, ChevronRight, Store } from 'lucide-react'
import { useAuth } from '../../context/AuthContext';
import { assets } from '../../assets/assets';


const navLinks = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { to: '/admin/movies', label: 'Movies', icon: Film },
    { to: '/admin/theaters', label: 'Theaters', icon: Store },
    { to: '/admin/shows', label: 'Shows', icon: CalendarDays },
    { to: '/admin/bookings', label: 'Bookings', icon: Ticket },
]

const AdminLayout = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { logout, user } = useAuth()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    const isActive = (link) => {
        if (link.exact) return location.pathname === link.to
        return location.pathname.startsWith(link.to)
    }

    const SidebarContent = () => (
        <div className='flex flex-col h-full'>
            <div className='px-6 py-5 border-b border-gray-700/50'>
                <img src={assets.logo} alt='logo' className='w-28 h-auto' />
                <p className='text-xs text-primary font-semibold mt-1 tracking-widest uppercase'>Admin Panel</p>
            </div>

            <nav className='flex-1 px-3 py-4 space-y-1'>
                {navLinks.map((link) => (
                    <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition group ${
                            isActive(link)
                                ? 'bg-primary text-white'
                                : 'text-gray-400 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        <link.icon className='w-4.5 h-4.5' />
                        {link.label}
                        {isActive(link) && <ChevronRight className='ml-auto w-4 h-4' />}
                    </Link>
                ))}
            </nav>

            <div className='px-3 py-4 border-t border-gray-700/50'>
                <div className='flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 mb-3'>
                    <div className='w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold'>
                        {user?.name?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div className='overflow-hidden'>
                        <p className='text-sm font-medium truncate'>{user?.name || 'Admin'}</p>
                        <p className='text-xs text-gray-500 truncate'>{user?.email}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className='w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition font-medium'
                >
                    <LogOut className='w-4 h-4' /> Logout
                </button>
                <Link
                    to='/'
                    className='mt-1 w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/10 transition'
                >
                    ← Back to Site
                </Link>
            </div>
        </div>
    )

    return (
        <div className='min-h-screen flex bg-[#0c0c0e] text-white'>
            {/* Desktop Sidebar */}
            <aside className='hidden md:flex w-64 flex-shrink-0 flex-col bg-gray-900/80 border-r border-gray-700/50 fixed h-full z-40'>
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className='md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm'
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            <aside className={`md:hidden fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-gray-700/50 z-50 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <button onClick={() => setSidebarOpen(false)} className='absolute top-4 right-4 p-1 hover:bg-white/10 rounded-lg'>
                    <X className='w-5 h-5' />
                </button>
                <SidebarContent />
            </aside>

            {/* Main Content */}
            <main className='flex-1 md:ml-64 flex flex-col min-h-screen'>
                {/* Top bar for mobile */}
                <div className='md:hidden flex items-center gap-4 px-4 py-4 border-b border-gray-700/50 bg-gray-900/80'>
                    <button onClick={() => setSidebarOpen(true)} className='p-2 hover:bg-white/10 rounded-lg'>
                        <Menu className='w-5 h-5' />
                    </button>
                    <img src={assets.logo} alt='logo' className='w-24 h-auto' />
                    <span className='text-xs text-primary font-semibold ml-auto tracking-wider uppercase'>Admin</span>
                </div>

                <div className='flex-1 p-6 md:p-8'>
                    <Outlet />
                </div>
            </main>
        </div>
    )
}

export default AdminLayout