import React, { useState, useEffect } from 'react'
import axios from 'axios'
import MovieCard from '../components/MovieCard'
import BlurCircle from '../components/BlurCircle'

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const { data } = await axios.get('/api/movies');
        setMovies(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movies', error);
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  if (loading) {
    return <div className='flex justify-center items-center h-screen'>Loading...</div>;
  }

  return movies.length > 0 ? (
    <div className='relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-27 overflow-hidden min-h-[80vh] '>
      <BlurCircle top='150px' left='0px' />
      <h1 className='text-lg font-medium my-4'>Now Showing</h1>
      <BlurCircle right='50px' bottom='50px' />
      <div className='flex flex-wrap max-sm:justify-center gap-8'>
        {movies.map((show) => (
          <MovieCard key={show.id || show._id} movie={show} />
        ))}
      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-3xl font-bold text-center'>No Movies Available...</h1>
    </div>
  )
}

export default Movies