import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const CityContext = createContext();

export const useCity = () => useContext(CityContext);

export const CityProvider = ({ children }) => {
    const [city, setCity] = useState(localStorage.getItem('movieCity') || null);
    const [isDetecting, setIsDetecting] = useState(false);

    useEffect(() => {
        if (city) {
            localStorage.setItem('movieCity', city);
        }
    }, [city]);

    const detectLocation = () => {
        setIsDetecting(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const { latitude, longitude } = position.coords;
                        // Use OpenStreetMap Nominatim for free reverse geocoding
                        const { data } = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                        
                        const detectedCity = data.address.city || data.address.town || data.address.village || data.address.state_district;
                        if (detectedCity) {
                            setCity(detectedCity);
                        } else {
                            console.warn("Could not determine city from coordinates");
                        }
                    } catch (error) {
                        console.error("Error detecting location:", error);
                    } finally {
                        setIsDetecting(false);
                    }
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    setIsDetecting(false);
                }
            );
        } else {
            console.error("Geolocation not supported");
            setIsDetecting(false);
        }
    };

    return (
        <CityContext.Provider value={{ city, setCity, detectLocation, isDetecting }}>
            {children}
        </CityContext.Provider>
    );
};
