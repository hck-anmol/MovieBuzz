import { MenuIcon, SearchIcon, TicketPlus, XIcon } from 'lucide-react'
import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { SignInButton, useClerk, UserButton, useUser } from '@clerk/clerk-react'


const Navbar = () => {
    const [isOpen, setisOpen] = useState(false);            //this state is for opening the nav bar when the isze of the screen reduces
    const { user } = useUser()
    const { openSignIn } = useClerk()                     //this will enable the signin drop down menu which is used in the button mentioned below 

    const Navigate = useNavigate()
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
                <XIcon className='md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer' onClick={() => setisOpen(!isOpen)} />
                <Link to='/' onClick={() => { scrollTo(0, 0); setisOpen(false) }}>Home</Link>
                <Link to='/movies' onClick={() => { scrollTo(0, 0); setisOpen(false) }}>Movies</Link>
                <Link to='/' onClick={() => { scrollTo(0, 0); setisOpen(false) }}>Theaters</Link>
                <Link to='/' onClick={() => { scrollTo(0, 0); setisOpen(false) }}>Releases</Link>
                <Link to='/favorites' onClick={() => { scrollTo(0, 0); setisOpen(false) }}>Favorites</Link>
            </div>
            <div className='flex items-center gap-8'>
                <SearchIcon className='max-md:hidden w-6 h-6 cursor-pointer' />
                {
                    !user ? (
                        <button onClick={openSignIn} className='px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer'>Login</button>

                    ) : (
                        <UserButton>
                            <UserButton.MenuItems>
                                <UserButton.Action label='My Booking' labelIcon={<TicketPlus  /**here ticket plus is lucid react's icon */ width={15} />} onClick={() => { Navigate('/mybookings') }} />         {/** by default we have two menu items, manage acount and sign out, and to add more of the menu items we do this  */}
                            </UserButton.MenuItems>
                        </UserButton>
                    )
                }
            </div>
            <MenuIcon className='max-md:ml-4 md:hidden w-8 h-8 cursor-pointer' onClick={() => setisOpen(!isOpen)} />
        </div>
    )
}

export default Navbar