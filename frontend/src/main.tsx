import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { DocProvider } from './contexts/documentContext'

const root = createRoot(document.getElementById('root')!)
root.render(
  <React.StrictMode>
    <DocProvider>
      <App />
    </DocProvider>
  </React.StrictMode>
)
