import { useState } from 'react'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import './contact.css'

function Contact() {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
    const [status, setStatus] = useState('')

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        setStatus('')
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
            setStatus('Please fill in all required fields.')
            return
        }

        setStatus('Thank you! Your message has been submitted. We will reply soon.')
        setFormData({ name: '', email: '', subject: '', message: '' })
    }

    return (
        <>
            <Navbar />
            <main className="contact-page">
                <section className="contact-hero">
                    <div className="contact-hero-copy">
                        <p className="section-subtitle">Contact Us</p>
                        <h1>We are here for your healthcare needs.</h1>
                        <p>
                            Reach out to our team for appointments, medical questions, or support with your visit.
                            We are available by phone, email, or the form below.
                        </p>
                    </div>
                </section>

                <section className="contact-layout">
                    <div className="contact-card contact-form-card">
                        <h2>Send a message</h2>
                        <form onSubmit={handleSubmit} className="contact-form">
                            <label>
                                Name<span>*</span>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
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
                                Subject
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder="Reason for contacting us"
                                />
                            </label>

                            <label>
                                Message<span>*</span>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Write your message"
                                    rows="6"
                                    required
                                />
                            </label>

                            <button type="submit" className="btn btn-primary">Send Message</button>
                            {status && <p className="contact-status">{status}</p>}
                        </form>
                    </div>

                    <div className="contact-card contact-info-card">
                        <h2>Contact details</h2>
                        <p>If you need immediate assistance, please call our front desk or appointment line.</p>
                        <div className="contact-details">
                            <div>
                                <strong>Phone</strong>
                                <p>+91 161 1234567</p>
                            </div>
                            <div>
                                <strong>Email</strong>
                                <p>info@medicarehospital.com</p>
                            </div>
                            <div>
                                <strong>Address</strong>
                                <p>123 MediCare Road, Civil Lines, Ludhiana, Punjab, India</p>
                            </div>
                        </div>
                        <p className="contact-note">Our support team is available Monday to Saturday, 8:00 AM to 8:00 PM.</p>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}

export default Contact
