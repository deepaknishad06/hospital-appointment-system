import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/home.jsx'
import About from './pages/about.jsx'
import Doctors from './pages/doctors.jsx'
import Contact from './pages/contact.jsx'
import Login from './pages/login.jsx'
import Dashboard from './pages/dashboard.jsx'
import BookAppointment from './pages/bookAppointment.jsx'
import Profile from './components/profile.jsx'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route path="/doctor-profile/:doctorId" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
