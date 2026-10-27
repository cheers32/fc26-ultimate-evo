import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { installNumberInputWheelGuard } from './utils/numberInputWheel'

installNumberInputWheelGuard()

// The cube lesson is its own page with nothing to do with the FC app, so it's loaded only when
// you go there.
const CubeApp = lazy(() => import('./cube/CubeApp'))
const isCubePage = window.location.pathname.replace(/\/+$/, '') === '/cube'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isCubePage ? (
      <Suspense fallback={null}>
        <CubeApp />
      </Suspense>
    ) : (
      <App />
    )}
  </React.StrictMode>,
)
