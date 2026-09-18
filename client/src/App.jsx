import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Estimate from './pages/Estimate'
import ChatBot from './components/ChatBot'
import CursorGlow from './components/CursorGlow'

function App() {
  return (
    <>
      <CursorGlow />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/estimate" element={<Estimate />} />
      </Routes>
      <ChatBot />
    </>
  )
}

export default App
