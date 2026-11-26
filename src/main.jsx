import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import NewsProvider from './context/NewsProvider.jsx'

// NewsProvider wraps the whole app, so every component can read the news with useContext.
// You don't need to change this file.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NewsProvider>
      <App />
    </NewsProvider>
  </StrictMode>,
)
