import { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('movieFavorites');
    if (stored) {
      try { setFavorites(JSON.parse(stored)); } catch {}
    }
  }, []);

  const toggleFavorite = (movie) => {
    const movieId = movie.id || movie._id;
    setFavorites(prev => {
      const exists = prev.find(m => (m.id || m._id) === movieId);
      const updated = exists
        ? prev.filter(m => (m.id || m._id) !== movieId)
        : [...prev, movie];
      localStorage.setItem('movieFavorites', JSON.stringify(updated));
      return updated;
    });
  };

  const isFavorite = (movieId) => favorites.some(m => (m.id || m._id) === movieId);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext); 