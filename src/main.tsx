import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/components/styles.css'
import './styles/components/header.css'
import './styles/components/card.css'
import './styles/components/inputs.css'
import './styles/components/buttons.css'
import './styles/components/participants.css'
import './styles/components/reveal.css'
import './styles/components/animations.css'
import RevealPage from './pages/Reveal'
import NotFound from './pages/NotFound'

const root = createRoot(document.getElementById('root')!)
const path = window.location.pathname
if (path === '/reveal') {
  root.render(
    <React.StrictMode>
      <RevealPage />
    </React.StrictMode>
  )
} else if (path === '/' || path === '') {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
} else {
  root.render(
    <React.StrictMode>
      <NotFound />
    </React.StrictMode>
  )
}
