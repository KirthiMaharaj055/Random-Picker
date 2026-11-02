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
const renderRoute = () => {
  const path = window.location.hash.slice(1) || '/'
  const page = path === '/reveal' ? <RevealPage /> : path === '/' ? <App /> : <NotFound />

  root.render(<React.StrictMode>{page}</React.StrictMode>)
}

renderRoute()
window.addEventListener('hashchange', renderRoute)
