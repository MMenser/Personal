import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import AppPro from './pro/AppPro.tsx'


const params = new URLSearchParams(window.location.search)

const view = params.has('playful')
  ? <App />
  : <AppPro />
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {view}
  </StrictMode>,
)
