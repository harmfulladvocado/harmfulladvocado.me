import React from 'react'
import ReactDOM from 'react-dom/client'

import { App } from './App.tsx'

const container = document.getElementById('app')

if (container !== null) {
  const root = ReactDOM.createRoot(container)
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}
