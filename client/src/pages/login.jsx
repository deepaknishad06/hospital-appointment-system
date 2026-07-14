import { useState } from 'react'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import { authAxios } from '../services/api'
import './login.css'

function Login() {
    const [credentials, setCredentials] = useState({ email: '', password: '' })
    const [patientRegisterData, setPatientRegisterData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
    })
    const [doctorRegisterData, setDoctorRegisterData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        specialization: ''
    })
    const [status, setStatus] = useState('')
    const [activeTab, setActiveTab] = useState('patient-login') // 'patient-login', 'patient-register', 'doctor-login', 'doctor-register'

    const handleCredentialsChange = (event) => {
        const { name, value } = event.target
        setCredentials((prev) => ({ ...prev, [name]: value }))
        setStatus('')
    }

    const handlePatientRegisterChange = (event) => {
        const { name, value } = event.target
        setPatientRegisterData((prev) => ({ ...prev, [name]: value }))
        setStatus('')
    }

    const handleDoctorRegisterChange = (event) => {
        const { name, value } = event.target
        setDoctorRegisterData((prev) => ({ ...prev, [name]: value }))
        setStatus('')
    }

    const handleLogin = async (event) => {
        event.preventDefault()

        if (!credentials.email.trim() || !credentials.password.trim()) {
            setStatus('Email and password are required.')
            return
        }

        try {
            const response = await authAxios.post('/api/auth/login', credentials)
            localStorage.setItem('hospital_token', response.data.token)
            localStorage.setItem('hospital_user', JSON.stringify(response.data.user))
            window.location.href = '/dashboard'
        } catch (error) {
            setStatus(error.response?.data?.message || 'Login failed')
        }
    }

    const handlePatientRegister = async (event) => {
        event.preventDefault()

        if (!patientRegisterData.name.trim() || !patientRegisterData.email.trim() || !patientRegisterData.password.trim()) {
            setStatus('Name, email, and password are required.')
            return
        }

        try {
            await authAxios.post('/api/auth/register', {
                ...patientRegisterData,
                role: 'patient'
            })
            setStatus('Registration successful! Please login to your account.')
            setPatientRegisterData({ name: '', email: '', password: '', phone: '' })
            setTimeout(() => {
                setActiveTab('patient-login')
                setStatus('')
            }, 2000)
        } catch (error) {
            setStatus(error.response?.data?.message || 'Registration failed')
        }
    }

    const handleDoctorRegister = async (event) => {
        event.preventDefault()

        if (!doctorRegisterData.name.trim() || !doctorRegisterData.email.trim() || !doctorRegisterData.password.trim() || !doctorRegisterData.specialization.trim()) {
            setStatus('Please complete all required registration fields.')
            return
        }

        try {
            await authAxios.post('/api/auth/register', {
                ...doctorRegisterData,
                role: 'doctor'
            })
            setStatus('Registration submitted. Await admin approval before logging in.')
            setDoctorRegisterData({ name: '', email: '', password: '', phone: '', specialization: '' })
            setTimeout(() => {
                setActiveTab('patient-login')
                setStatus('')
            }, 2000)
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
                        <div className="login-tabs">
                            <button
                                className={`tab-button ${activeTab === 'patient-login' ? 'active' : ''}`}
                                onClick={() => { setActiveTab('patient-login'); setStatus('') }}
                            >
                                Login as Patient
                            </button>
                            <button
                                className={`tab-button ${activeTab === 'patient-register' ? 'active' : ''}`}
                                onClick={() => { setActiveTab('patient-register'); setStatus('') }}
                            >
                                Register as Patient
                            </button>
                            <button
                                className={`tab-button ${activeTab === 'doctor-login' ? 'active' : ''}`}
                                onClick={() => { setActiveTab('doctor-login'); setStatus('') }}
                            >
                                Doctor Login
                            </button>
                            <button
                                className={`tab-button ${activeTab === 'doctor-register' ? 'active' : ''}`}
                                onClick={() => { setActiveTab('doctor-register'); setStatus('') }}
                            >
                                Register as Doctor
                            </button>
                        </div>

                        {/* Patient Login Tab */}
                        {activeTab === 'patient-login' && (
                            <>
                                <h1>Patient Login</h1>
                                <p>Enter your email and password to access your patient account.</p>
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
                            </>
                        )}

                        {/* Patient Register Tab */}
                        {activeTab === 'patient-register' && (
                            <>
                                <h1>Patient Registration</h1>
                                <p>Create your account to book appointments and manage your health records.</p>
                                <form className="login-form" onSubmit={handlePatientRegister}>
                                    <label>
                                        Full Name
                                        <input
                                            name="name"
                                            value={patientRegisterData.name}
                                            onChange={handlePatientRegisterChange}
                                            placeholder="John Doe"
                                            required
                                        />
                                    </label>

                                    <label>
                                        Email
                                        <input
                                            type="email"
                                            name="email"
                                            value={patientRegisterData.email}
                                            onChange={handlePatientRegisterChange}
                                            placeholder="patient@example.com"
                                            required
                                        />
                                    </label>

                                    <label>
                                        Password
                                        <input
                                            type="password"
                                            name="password"
                                            value={patientRegisterData.password}
                                            onChange={handlePatientRegisterChange}
                                            placeholder="Create a password"
                                            required
                                        />
                                    </label>

                                    <label>
                                        Phone (Optional)
                                        <input
                                            name="phone"
                                            value={patientRegisterData.phone}
                                            onChange={handlePatientRegisterChange}
                                            placeholder="(555) 123-4567"
                                        />
                                    </label>

                                    <button type="submit" className="btn btn-primary">Register</button>
                                    {status && <p className="login-status">{status}</p>}
                                </form>
                            </>
                        )}

                        {/* Doctor Login Tab */}
                        {activeTab === 'doctor-login' && (
                            <>
                                <h1>Doctor Login</h1>
                                <p>Enter your email and password to access your doctor account.</p>
                                <form className="login-form" onSubmit={handleLogin}>
                                    <label>
                                        Email
                                        <input
                                            type="email"
                                            name="email"
                                            value={credentials.email}
                                            onChange={handleCredentialsChange}
                                            placeholder="doctor@example.com"
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
                                    <span>Don't have an account?</span>
                                    <button type="button" onClick={() => { setActiveTab('doctor-register'); setStatus('') }}>
                                        Register here
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Doctor Register Tab */}
                        {activeTab === 'doctor-register' && (
                            <>
                                <h1>Doctor Registration</h1>
                                <p>Submit your details to join the medical team. Admin approval is required before login.</p>
                                <form className="login-form" onSubmit={handleDoctorRegister}>
                                    <label>
                                        Name
                                        <input
                                            name="name"
                                            value={doctorRegisterData.name}
                                            onChange={handleDoctorRegisterChange}
                                            placeholder="Dr. Jane Doe"
                                            required
                                        />
                                    </label>

                                    <label>
                                        Email
                                        <input
                                            type="email"
                                            name="email"
                                            value={doctorRegisterData.email}
                                            onChange={handleDoctorRegisterChange}
                                            placeholder="doctor@example.com"
                                            required
                                        />
                                    </label>

                                    <label>
                                        Password
                                        <input
                                            type="password"
                                            name="password"
                                            value={doctorRegisterData.password}
                                            onChange={handleDoctorRegisterChange}
                                            placeholder="Create a password"
                                            required
                                        />
                                    </label>

                                    <label>
                                        Phone
                                        <input
                                            name="phone"
                                            value={doctorRegisterData.phone}
                                            onChange={handleDoctorRegisterChange}
                                            placeholder="(555) 123-4567"
                                        />
                                    </label>

                                    <label>
                                        Specialization
                                        <input
                                            name="specialization"
                                            value={doctorRegisterData.specialization}
                                            onChange={handleDoctorRegisterChange}
                                            placeholder="Cardiology"
                                            required
                                        />
                                    </label>

                                    <button type="submit" className="btn btn-primary">Submit Registration</button>
                                    {status && <p className="login-status">{status}</p>}
                                </form>

                                <div className="login-actions">
                                    <span>Already have an account?</span>
                                    <button type="button" onClick={() => { setActiveTab('doctor-login'); setStatus('') }}>
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
