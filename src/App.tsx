import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CreateMuseum from './pages/CreateMuseum'
import EditMuseum from './pages/EditMuseum'
import MuseumPublic from './pages/MuseumPublic'
import MuseumViewer from './pages/MuseumViewer'

export default function App(){
  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/create" element={<CreateMuseum/>}/>
      <Route path="/edit/:id" element={<EditMuseum/>}/>
      <Route path="/m/:slug" element={<MuseumPublic/>}/>
      <Route path="/m/:slug/enter" element={<MuseumViewer/>}/>
    </Routes>
  )
}
