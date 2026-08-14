import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Machine from './pages/Machine'
import Alertes from './pages/Alertes'
import Maintenance from './pages/Maintenance'
import Historique from './pages/Historique'
import Rapports from './pages/Rapports'
import Profil from './pages/Profil'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/machine' element={<Machine />} />
        <Route path='/alertes' element={<Alertes />} />
        <Route path='/maintenance' element={<Maintenance />} />
        <Route path='/historique' element={<Historique />} />
        <Route path='/rapports' element={<Rapports />} />
        <Route path='/profil' element={<Profil />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App