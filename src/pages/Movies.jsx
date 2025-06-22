import React from 'react'
import { dummyShowsData } from '../assets/assets'
import MovieCard from '../components/MovieCard'

const Movies = () => {
  return (
    <div className='flex justify-center items-center px-27 py-25'>
      <div className='flex flex-wrap max-sm:justify-center gap-8 mt-8'>
        {dummyShowsData.slice(0, 7).map((show) => (
          <MovieCard key={show._id} movie={show} />
        ))}
      </div>
    </div>
  )
}

export default Movies