import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SectionPage from './pages/SectionPage'
import TeacherDetail from './pages/TeacherDetail'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/section/:sectionId" element={<SectionPage />} />
      <Route path="/teacher/:teacherId" element={<TeacherDetail />} />
    </Routes>
  )
}

export default App