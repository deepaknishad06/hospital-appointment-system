import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import './bookAppointment.css'

const doctors = [
    'Dr. Sandeep Chopra',
    'Dr. Jagminder Singh',
    'Dr. Hunny Bansal',
]

function BookAppointment() {
    const [formData, setFormData] = useState({
        patientName: '',
        email: '',
        phone: '',
        doctor: doctors[0],
        appointmentDate: '',
        appointmentTime: '',
        symptoms: '',
    })
    const [status, setStatus] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        setStatus('')
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!formData.patientName.trim() || !formData.email.trim() || !formData.appointmentDate || !formData.appointmentTime) {
            setStatus('Please fill in all required fields.')
            return
        }

        setIsSubmitting(true)

        try {
            const response = await fetch('http://localhost:5000/api/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Failed to save appointment')
            }

            setStatus('Appointment request sent successfully. We will contact you soon.')
            setFormData({
                patientName: '',
                email: '',
                phone: '',
                doctor: doctors[0],
                appointmentDate: '',
                appointmentTime: '',
                symptoms: '',
            })
        } catch (error) {
            setStatus(error.message)
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
                                <select name="doctor" value={formData.doctor} onChange={handleChange}>
                                    {doctors.map((doctor) => (
                                        <option key={doctor} value={doctor}>{doctor}</option>
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
