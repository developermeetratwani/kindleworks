import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CursorGlow from './components/CursorGlow'

const Estimate = lazy(() => import('./pages/Estimate'))
const NotFound = lazy(() => import('./pages/NotFound'))
const ChatBot = lazy(() => import('./components/ChatBot'))

function App() {
  return (
    <>
      <CursorGlow />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/estimate" element={<Estimate />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Suspense fallback={null}>
        <ChatBot />
      </Suspense>
    </>
  )
}

export default App
