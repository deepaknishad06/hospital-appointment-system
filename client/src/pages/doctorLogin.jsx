import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import { authAxios } from '../services/api'
import './login.css'

function DoctorLogin() {
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [status, setStatus] = useState('')
    const navigate = useNavigate()

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        setStatus('')
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            const response = await authAxios.post('/api/auth/login', formData)
            localStorage.setItem('hospital_token', response.data.token)
            localStorage.setItem('hospital_user', JSON.stringify(response.data.user))
            if (response.data.user.role !== 'doctor') {
                setStatus('Only doctors may use this login page.')
                return
            }
            navigate('/dashboard')
        } catch (error) {
            setStatus(error.response?.data?.message || 'Login failed')
        }
    }

    return (
        <>
            <Navbar />
            <main className="login-page">
                <section className="login-hero">
                    <div className="login-card">
                        <h1>Doctor Login</h1>
                        <p>Log in to manage patients, approve appointments, and access the admin panel.</p>
                        <form className="login-form" onSubmit={handleSubmit}>
                            <label>
                                Email
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="doctor@example.com"
                                    required
                                />
                            </label>

                            <label>
                                Password
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    required
                                />
                            </label>

                            <button type="submit" className="btn btn-primary">Login</button>
                            {status && <p className="login-status">{status}</p>}
                        </form>
                        <p className="login-note">New doctor? <Link to="/doctor-register">Register here</Link>.</p>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}

export default DoctorLogin
