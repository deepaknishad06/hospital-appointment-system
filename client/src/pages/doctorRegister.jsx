import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import { authAxios } from '../services/api'
import './contact.css'

function DoctorRegister() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', specialization: '' })
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
            await authAxios.post('/users/doctor/register', formData)
            setStatus('Registration submitted. Await admin approval.')
            setTimeout(() => navigate('/doctor-login'), 1500)
        } catch (error) {
            setStatus(error.response?.data?.message || 'Registration failed')
        }
    }

    return (
        <>
            <Navbar />
            <main className="contact-page">
                <section className="contact-hero">
                    <div className="contact-hero-copy">
                        <p className="section-subtitle">Doctor Registration</p>
                        <h1>Register to join our medical team.</h1>
                        <p>Submit your details and wait for admin approval before logging in.</p>
                    </div>
                </section>

                <section className="contact-layout">
                    <div className="contact-card">
                        <h2>Sign up as a doctor</h2>
                        <form className="contact-form" onSubmit={handleSubmit}>
                            <label>
                                Name
                                <input name="name" value={formData.name} onChange={handleChange} required />
                            </label>
                            <label>
                                Email
                                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                            </label>
                            <label>
                                Password
                                <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                            </label>
                            <label>
                                Phone
                                <input name="phone" value={formData.phone} onChange={handleChange} />
                            </label>
                            <label>
                                Specialization
                                <input name="specialization" value={formData.specialization} onChange={handleChange} required />
                            </label>
                            <button type="submit" className="btn btn-primary">Submit Registration</button>
                        </form>
                        {status && <p className="contact-status">{status}</p>}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}

export default DoctorRegister
