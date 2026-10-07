import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppPro from './pro/AppPro.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppPro />
  </StrictMode>,
)
