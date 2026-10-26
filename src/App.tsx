import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import CreateMuseum from './pages/CreateMuseum'
import EditMuseum from './pages/EditMuseum'
import MuseumPublic from './pages/MuseumPublic'
import MuseumViewer from './pages/MuseumViewer'

export default function App(){
  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={<Navigate to="/" replace/>}/>
      <Route path="/register" element={<Navigate to="/" replace/>}/>
      <Route path="/dashboard" element={<Navigate to="/" replace/>}/>
      <Route path="/create" element={<CreateMuseum/>}/>
      <Route path="/edit/:id" element={<EditMuseum/>}/>
      <Route path="/m/:slug" element={<MuseumPublic/>}/>
      <Route path="/m/:slug/enter" element={<MuseumViewer/>}/>
    </Routes>
  )
}
