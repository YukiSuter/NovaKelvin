import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

const rootElement = document.getElementById('ticketing-root')

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}
