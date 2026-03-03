import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import AppPro from './pro/AppPro.tsx'

const isPlayful = new URLSearchParams(window.location.search).has('playful')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isPlayful ? <App /> : <AppPro />}
  </StrictMode>,
)
