import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import timeformat from '../lib/timeformat';

const SearchModal = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [allMovies, setAllMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setResults([]);
            setTimeout(() => inputRef.current?.focus(), 50);
            fetchAllMovies();
        }
    }, [isOpen]);

    const fetchAllMovies = async () => {
        if (allMovies.length > 0) return;
        try {
            setLoading(true);
            const { data } = await axios.get('/api/movies');
            setAllMovies(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }
        const q = query.toLowerCase();
        const filtered = allMovies.filter(m =>
            m.title?.toLowerCase().includes(q) ||
            m.genres?.some(g => g.name?.toLowerCase().includes(q)) ||
            m.original_language?.toLowerCase().includes(q)
        );
        setResults(filtered.slice(0, 8));
    }, [query, allMovies]);

    const handleSelect = (movie) => {
        navigate(`/movies/${movie.id || movie._id}`);
        scrollTo(0, 0);
        onClose();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/60 backdrop-blur-sm p-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-[#1a1c29] border border-gray-700/50 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-700/50">
                    <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search movies, genres..."
                        className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none text-base"
                    />
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto">
                    {loading && (
                        <p className="text-gray-400 text-sm text-center py-8">Loading movies...</p>
                    )}

                    {!loading && query.trim() === '' && (
                        <div className="px-4 py-6">
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-semibold">All Movies</p>
                            <div className="flex flex-wrap gap-2">
                                {allMovies.slice(0, 12).map(m => (
                                    <button
                                        key={m.id || m._id}
                                        onClick={() => handleSelect(m)}
                                        className="text-sm text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1 rounded-full transition"
                                    >
                                        {m.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {!loading && query.trim() !== '' && results.length === 0 && (
                        <p className="text-gray-400 text-sm text-center py-8">No movies found for "{query}"</p>
                    )}

                    {!loading && results.length > 0 && (
                        <ul>
                            {results.map(movie => (
                                <li key={movie.id || movie._id}>
                                    <button
                                        onClick={() => handleSelect(movie)}
                                        className="w-full flex items-center gap-4 px-4 py-3 hover:bg-white/5 transition text-left"
                                    >
                                        <img
                                            src={movie.poster_path || movie.backdrop_path}
                                            alt={movie.title}
                                            className="w-10 h-14 object-cover rounded flex-shrink-0"
                                            onError={e => { e.target.style.display = 'none'; }}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-white truncate">{movie.title}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {movie.release_date?.split('-')[0]}
                                                {movie.genres?.length > 0 && ` · ${movie.genres.slice(0, 2).map(g => g.name).join(', ')}`}
                                                {movie.runtime ? ` · ${timeformat(movie.runtime)}` : ''}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0">
                                            <Star className="w-3 h-3 text-primary fill-primary" />
                                            {movie.vote_average?.toFixed(1)}
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="px-4 py-2 border-t border-gray-700/50 flex items-center gap-4 text-xs text-gray-500">
                    <span>↑↓ navigate</span>
                    <span>↵ select</span>
                    <span>esc close</span>
                </div>
            </div>
        </div>
    );
};

export default SearchModal;