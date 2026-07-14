import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import { authAxios } from '../services/api'
import './bookAppointment.css'

const doctorOptions = [
    { id: 'sandeep-chopra', name: 'Dr. Sandeep Chopra' },
    { id: 'jagminder-singh', name: 'Dr. Jagminder Singh' },
    { id: 'hunny-bansal', name: 'Dr. Hunny Bansal' },
]

function BookAppointment() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        patientName: '',
        email: '',
        phone: '',
        doctorId: doctorOptions[0].id,
        appointmentDate: '',
        appointmentTime: '',
        symptoms: '',
    })
    const [status, setStatus] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (!localStorage.getItem('hospital_token')) {
            alert('Login patient first for booking appointments')
            navigate('/login')
        }
    }, [navigate])

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        setStatus('')
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!formData.patientName.trim() || !formData.email.trim() || !formData.doctorId || !formData.appointmentDate || !formData.appointmentTime) {
            setStatus('Please fill in all required fields.')
            return
        }

        setIsSubmitting(true)

        try {
            const selectedDoctor = doctorOptions.find((doctor) => doctor.id === formData.doctorId)
            const payload = {
                ...formData,
                doctorId: formData.doctorId,
                doctorName: selectedDoctor?.name || formData.doctorId,
            }

            await authAxios.post('/api/appointments', payload)

            setStatus('Appointment request sent successfully. We will contact you soon.')
            setFormData({
                patientName: '',
                email: '',
                phone: '',
                doctorId: doctorOptions[0].id,
                appointmentDate: '',
                appointmentTime: '',
                symptoms: '',
            })
        } catch (error) {
            setStatus(error.response?.data?.message || error.message || 'Failed to save appointment')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <Navbar />

            <main className="appointment-page">
                <section className="appointment-hero">
                    <div className="appointment-hero-content">
                        <h1>Book Your Appointment</h1>
                        <p>Schedule a visit with our expert doctors and get fast, compassionate care.</p>
                    </div>
                </section>

                <section className="appointment-form-section">
                    <div className="appointment-form-card">
                        <h2>Appointment Request</h2>
                        <form className="appointment-form" onSubmit={handleSubmit}>
                            <label>
                                Name<span>*</span>
                                <input
                                    type="text"
                                    name="patientName"
                                    value={formData.patientName}
                                    onChange={handleChange}
                                    placeholder="Your full name"
                                    required
                                />
                            </label>

                            <label>
                                Email<span>*</span>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Your email address"
                                    required
                                />
                            </label>

                            <label>
                                Phone
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Mobile number"
                                />
                            </label>

                            <label>
                                Select Doctor<span>*</span>
                                <select name="doctorId" value={formData.doctorId} onChange={handleChange}>
                                    {doctorOptions.map((doctor) => (
                                        <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                                    ))}
                                </select>
                            </label>

                            <div className="appointment-row">
                                <label>
                                    Date<span>*</span>
                                    <input
                                        type="date"
                                        name="appointmentDate"
                                        value={formData.appointmentDate}
                                        onChange={handleChange}
                                        required
                                    />
                                </label>
                                <label>
                                    Time<span>*</span>
                                    <input
                                        type="time"
                                        name="appointmentTime"
                                        value={formData.appointmentTime}
                                        onChange={handleChange}
                                        required
                                    />
                                </label>
                            </div>

                            <label>
                                Symptoms
                                <textarea
                                    name="symptoms"
                                    value={formData.symptoms}
                                    onChange={handleChange}
                                    placeholder="Describe your symptoms or concern"
                                />
                            </label>

                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? 'Sending...' : 'Submit Appointment'}
                            </button>

                            {status && <p className="appointment-status">{status}</p>}
                        </form>
                    </div>
                </section>

                <section className="appointment-info-section">
                    <div className="appointment-info-card">
                        <h2>Need help?</h2>
                        <p>Call our appointment desk at <strong>+91 161 1234567</strong> or send an email to <strong>info@medicarehospital.com</strong>.</p>
                        <Link to="/" className="btn btn-secondary">Back to Home</Link>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    )
}

export default BookAppointment
