import React, { useState } from 'react';
import { useCity } from '../context/CityContext';
import { MapPin, Search, Crosshair, X } from 'lucide-react';

const CitySelectorModal = ({ isOpen, onClose }) => {
    const { setCity, detectLocation, isDetecting } = useCity();
    const [searchInput, setSearchInput] = useState('');
    const popularCities = [
        'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Ahmedabad', 
        'Chennai', 'Kolkata', 'Surat', 'Pune', 'Jaipur',
        'Lucknow', 'Kanpur', 'Nagpur', 'Visakhapatnam', 'Indore',
        'Bhopal', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana'
    ];
    if (!isOpen) return null;

    const handleSelectCity = (c) => {
        setCity(c);
        onClose();
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchInput.trim()) {
            handleSelectCity(searchInput.trim());
        }
    };

    const handleDetectLocation = async () => {
        detectLocation();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[#1a1c29] border border-gray-700/50 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition">
                    <X className="w-6 h-6" />
                </button>
                
                <div className="p-6">
                    <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                        <MapPin className="text-primary w-6 h-6" /> Pick your city
                    </h2>
                    
                    <form onSubmit={handleSearchSubmit} className="relative mb-8">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input 
                            type="text" 
                            placeholder="Search for your city..." 
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full bg-black/30 border border-gray-700 rounded-lg py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary transition"
                        />
                    </form>
                    
                    <button 
                        onClick={handleDetectLocation}
                        disabled={isDetecting}
                        className="w-full flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary py-3 rounded-lg border border-primary/30 transition mb-8 font-medium cursor-pointer"
                    >
                        <Crosshair className="w-5 h-5" />
                        {isDetecting ? 'Detecting...' : 'Detect my location'}
                    </button>
                    
                    <div>
                        <p className="text-sm text-gray-400 mb-4 uppercase tracking-wider font-semibold">Popular Cities</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                            {popularCities.map((c) => (
                                <button 
                                    key={c}
                                    onClick={() => handleSelectCity(c)}
                                    className="p-3 bg-white/5 border border-white/10 hover:border-primary hover:text-primary rounded-lg transition text-sm cursor-pointer"
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CitySelectorModal;
