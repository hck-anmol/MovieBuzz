import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { FavoritesProvider } from './context/FavoritesContext.jsx'
import { CityProvider } from './context/CityContext.jsx'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <FavoritesProvider>
      <CityProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </CityProvider>
    </FavoritesProvider>
  </AuthProvider>
)