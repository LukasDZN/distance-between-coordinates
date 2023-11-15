import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import App from './App'
import './App.css'

import Plausible from 'plausible-tracker'

const plausible = Plausible({
  domain: 'lukasdzn.github.io/distance-between-coordinates',
})

// This tracks the current page view and all future ones as well
plausible.enableAutoPageviews()

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route
          path="/about"
          element={
            <>
              <div className="text-center">
                <h1 className="text-xl">About</h1>
                <div>
                  <Link to="/" className="text-purple-400 underline">
                    Home
                  </Link>
                </div>
              </div>
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
