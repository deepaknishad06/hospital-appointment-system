import { useState } from 'react'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import { authAxios } from '../services/api'
import './login.css'

function Login() {
    const [credentials, setCredentials] = useState({ email: '', password: '' })
    const [registerData, setRegisterData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        specialization: ''
    })
    const [status, setStatus] = useState('')
    const [showRegister, setShowRegister] = useState(false)

    const handleCredentialsChange = (event) => {
        const { name, value } = event.target
        setCredentials((prev) => ({ ...prev, [name]: value }))
        setStatus('')
    }

    const handleRegisterChange = (event) => {
        const { name, value } = event.target
        setRegisterData((prev) => ({ ...prev, [name]: value }))
        setStatus('')
    }

    const handleLogin = async (event) => {
        event.preventDefault()

        if (!credentials.email.trim() || !credentials.password.trim()) {
            setStatus('Email and password are required.')
            return
        }

        try {
            const response = await authAxios.post('/auth/login', credentials)
            localStorage.setItem('hospital_token', response.data.token)
            localStorage.setItem('hospital_user', JSON.stringify(response.data.user))
            window.location.href = '/dashboard'
        } catch (error) {
            setStatus(error.response?.data?.message || 'Login failed')
        }
    }

    const handleRegister = async (event) => {
        event.preventDefault()

        if (!registerData.name.trim() || !registerData.email.trim() || !registerData.password.trim() || !registerData.specialization.trim()) {
            setStatus('Please complete all required registration fields.')
            return
        }

        try {
            await authAxios.post('/users/doctor/register', registerData)
            setStatus('Registration submitted. Await admin approval before logging in.')
            setShowRegister(false)
            setRegisterData({ name: '', email: '', password: '', phone: '', specialization: '' })
        } catch (error) {
            setStatus(error.response?.data?.message || 'Registration failed')
        }
    }

    return (
        <>
            <Navbar />
            <main className="login-page">
                <section className="login-hero">
                    <div className="login-card">
                        {!showRegister ? (
                            <>
                                <h1>Login</h1>
                                <p>Enter your email and password to access your patient or doctor account.</p>
                                <form className="login-form" onSubmit={handleLogin}>
                                    <label>
                                        Email
                                        <input
                                            type="email"
                                            name="email"
                                            value={credentials.email}
                                            onChange={handleCredentialsChange}
                                            placeholder="you@example.com"
                                            required
                                        />
                                    </label>

                                    <label>
                                        Password
                                        <input
                                            type="password"
                                            name="password"
                                            value={credentials.password}
                                            onChange={handleCredentialsChange}
                                            placeholder="Enter your password"
                                            required
                                        />
                                    </label>

                                    <button type="submit" className="btn btn-primary">Login</button>
                                    {status && <p className="login-status">{status}</p>}
                                </form>

                                <div className="login-actions">
                                    <span>Register as a doctor?</span>
                                    <button type="button" onClick={() => { setShowRegister(true); setStatus('') }}>
                                        Click here
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h1>Doctor Register</h1>
                                <p>Submit your details to join the medical team. Admin approval is required before login.</p>
                                <form className="login-form" onSubmit={handleRegister}>
                                    <label>
                                        Name
                                        <input
                                            name="name"
                                            value={registerData.name}
                                            onChange={handleRegisterChange}
                                            placeholder="Dr. Jane Doe"
                                            required
                                        />
                                    </label>

                                    <label>
                                        Email
                                        <input
                                            type="email"
                                            name="email"
                                            value={registerData.email}
                                            onChange={handleRegisterChange}
                                            placeholder="doctor@example.com"
                                            required
                                        />
                                    </label>

                                    <label>
                                        Password
                                        <input
                                            type="password"
                                            name="password"
                                            value={registerData.password}
                                            onChange={handleRegisterChange}
                                            placeholder="Create a password"
                                            required
                                        />
                                    </label>

                                    <label>
                                        Phone
                                        <input
                                            name="phone"
                                            value={registerData.phone}
                                            onChange={handleRegisterChange}
                                            placeholder="(555) 123-4567"
                                        />
                                    </label>

                                    <label>
                                        Specialization
                                        <input
                                            name="specialization"
                                            value={registerData.specialization}
                                            onChange={handleRegisterChange}
                                            placeholder="Cardiology"
                                            required
                                        />
                                    </label>

                                    <button type="submit" className="btn btn-primary">Submit Registration</button>
                                    {status && <p className="login-status">{status}</p>}
                                </form>

                                <div className="login-actions">
                                    <span>Already have an account?</span>
                                    <button type="button" onClick={() => { setShowRegister(false); setStatus('') }}>
                                        Login here
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}

export default Login
