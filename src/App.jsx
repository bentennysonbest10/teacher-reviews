import { Routes, Route } from 'react-router-dom'
import Gate from './pages/Gate'
import Home from './pages/Home'
import SectionPage from './pages/SectionPage'
import TeacherDetail from './pages/TeacherDetail'
import Leaderboard from './pages/Leaderboard'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Gate />} />
      <Route path="/home" element={<Home />} />
      <Route path="/section/:sectionId" element={<SectionPage />} />
      <Route path="/teacher/:teacherId" element={<TeacherDetail />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
    </Routes>
  )
}

export default App