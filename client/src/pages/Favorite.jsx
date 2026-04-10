import React from 'react'
import MovieCard from '../components/MovieCard'
import BlurCircle from '../components/BlurCircle'
import { useFavorites } from '../context/FavoritesContext'
import { useNavigate } from 'react-router-dom'
import { HeartOff } from 'lucide-react'

const Favorite = () => {
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  return favorites.length > 0 ? (
    <div className='relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-27 overflow-hidden min-h-[80vh]'>
      <BlurCircle top='150px' left='0px' />
      <h1 className='text-lg font-medium my-4'>Your Favorite Movies</h1>
      <BlurCircle right='50px' bottom='50px' />
      <div className='flex flex-wrap max-sm:justify-center gap-8'>
        {favorites.map((movie) => (
          <MovieCard key={movie.id || movie._id} movie={movie} />
        ))}
      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-6 min-h-[80vh]'>
      <HeartOff className='w-16 h-16 text-gray-600' />
      <h1 className='text-2xl font-semibold text-center'>No Favorites Yet</h1>
      <p className='text-gray-400 text-center max-w-xs'>Click the heart icon on any movie to save it here.</p>
      <button
        onClick={() => navigate('/movies')}
        className='px-8 py-3 bg-primary hover:bg-primary-dull transition rounded-md text-sm font-medium'
      >
        Browse Movies
      </button>
    </div>
  )
}

export default Favorite