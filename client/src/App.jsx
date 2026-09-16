import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Estimate from './pages/Estimate'
import ChatBot from './components/ChatBot'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/estimate" element={<Estimate />} />
      </Routes>
      <ChatBot />
    </>
  )
}

export default App
